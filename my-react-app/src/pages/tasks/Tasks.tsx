import { useEffect, useMemo, useState } from 'react';
import { Grid2X2Plus, List, SearchIcon, SquarePen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import API from '@/lib/axios';
import { setLoading, setShowAddTask } from '@/store/slices/projectSlice';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { toast } from 'sonner';
import { setCallGetTaskApi, setCallGetTaskPriorityApi, setCallGetTaskStatusApi, setSelectedTask, setTaskSelectedView } from '@/store/slices/taskSlice';
import type { TaskType } from '@/types/task';
import { dateComparator } from '@/lib/dateHelper';
import { getPriorityIcon } from '@/utils/getPriorityIcon';
import { statusTitleMap, targetTypeColorMap, taskPriorityColorMap, taskStatusColorMap } from '@/lib/badgeColor';
import { separatorColorMap } from '@/lib/separatorColor';
import { getTaskTypeIcon } from '@/utils/getTargetTypeIcon';
import SelectFilterStatus from '@/components/select/SelectFilterStatus';
import { CustomComboboxSelect } from '@/components/select/CustomComboboxSelect';
import { useNavigate, useSearchParams } from 'react-router';
import { CustomDropdownMenuWithTooltip } from '@/components/dropdown/CustomDropdownMenuWithTooltip';
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { setShowAddNote } from '@/store/slices/projectSlice';
import AddNoteDialog from '../dashboard/components/AddNoteDialog';
import { addNoteSchema, type AddNoteFormData } from '../dashboard/core/schema';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { setCallGetNoteApi } from '@/store/slices/noteSlice';
import type { NoteTagType } from '@/types/note';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);


const Tasks = () => {
  const { callGetTaskApi } = useAppSelector(state => state.task);
  const { selectedProject } = useAppSelector(state => state.project);
  const [tasks, setTasks] = useState<Record<string, TaskType[]>>({});
  const allTasks = Object.values(tasks).flat(); /* Get Flat all task */

  const dispatch = useDispatch()
  // const selectItemCustom = "text-xs h-7 py-1 data-[highlighted]:text-blue-500 hover:cursor-pointer";
  const selectedTaskView = useSelector(
    (state: RootState) => state.task?.selectedTaskView ?? 'grid'
  );
  const [searchTask, setSearchTask] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState<string>("all");
  const [selectedTaskPriority, setSelectedTaskPriority] = useState<string>("all");
  const [selectedTaskStatus, setSelectedTaskStatus] = useState<string>("all");
  const [targets, setTargets] = useState([]);
  const allTargets = Object.values(targets).flat();

  const [searchParams] = useSearchParams();
  const initialTargetId = searchParams.get("target_id") ?? "all";
  const [selectedTargetId, setSelectedTargetId] = useState<number | string>(initialTargetId);

  const initialTaskId = searchParams.get("task_id") ?? "all";
  const [selectedTaskId, setSelectedTaskId] = useState<number | string>(initialTaskId);
  const [selectedNoteTask, setSelectedNoteTask] = useState<TaskType | null>(null);
  const showAddNote = useAppSelector(state => state.project.showAddNote)
  const [noteTag, setNoteTag] = useState<NoteTagType[]>([]);

  const initialDate = searchParams.get("date") ?? "all";
  const [selectedDate, _setSelectedDate] = useState<Date | string>(initialDate);

  const navigate = useNavigate();

  //  Remove `target_id` from the URL only on first mount
  useEffect(() => {
    if (searchParams.has("target_id")) {
      searchParams.delete("target_id");
      navigate({ search: searchParams.toString() }, { replace: true }); // prevents push to history
    }
    if (searchParams.has('task_id')) {
      searchParams.delete("task_id");
      dispatch(setTaskSelectedView('grid'));
      navigate({ search: searchParams.toString() }, { replace: true }); // prevents push to history
    }
    if (searchParams.has("date")) {
      searchParams.delete("date");
      navigate({ search: searchParams.toString() }, { replace: true }); // prevents push to history
    }
  }, []);

  /*************** Start - Get The Project Tasks ******************/
  const getProjectTasks = async (projectId: number) => {
    try {
      const response = await API.get('get_projectsTasks', {
        params: { project_id: projectId }
      });

      if (response.data.success && typeof response.data.tasks === 'object') {
        setLoading(true);
        setTasks(response.data.tasks);
      }
    } catch (error) {
      toast.error('Failed to fetch projects tasks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!selectedProject?.project_id) return;

    if (callGetTaskApi) {
      dispatch(setCallGetTaskApi(false));
    }
    getProjectTasks(selectedProject.project_id);
    getProjectTargets(selectedProject.project_id);
  }, [callGetTaskApi, selectedProject?.project_id, dispatch]);
  /*************** End - Get The Project Tasks ******************/


  /*************** Start - Grid View Data ******************/
  const columns = useMemo(() => {
    const lowerSearch = searchTask.toLowerCase();
    const isOverdueFilter = selectedTaskStatus === "4";

    const filteredTasks = Object.entries(tasks).reduce((acc, [status, taskList]) => {
      // Filter each list based on title, description,
      let filteredList = taskList.filter((task) =>
        task.title.toLowerCase().includes(lowerSearch) ||
        task.description?.toLowerCase().includes(lowerSearch)
      );

      //  Apply selectedTaskType filter (target / general / all)
      if (selectedTaskType === "target") {
        filteredList = filteredList.filter((task) => task.target_id !== null && task.target_id !== undefined);
      } else if (selectedTaskType === "general") {
        filteredList = filteredList.filter((task) => task.target_id === null || task.target_id === undefined);
      }


      // Filter by selectedTargetId
      if (selectedTargetId !== undefined && selectedTargetId !== "all") {
        filteredList = filteredList.filter(
          (task) => String(task.target_id) === String(selectedTargetId)
        );
      }

      // Filter by selectedTaskId
      if (selectedTaskId !== undefined && selectedTaskId !== "all") {
        filteredList = filteredList.filter(
          (task) => String(task.id) === String(selectedTaskId)
        );
      }

      // Filter by selectedTaskPriority (1 | 2 | 3 | all)
      if (selectedTaskPriority !== "all") {
        filteredList = filteredList.filter(
          (task) => String(task.priority_id) === selectedTaskPriority
        );
      }

      // Filter by date (from query param)
      if (selectedDate !== "all") {
        filteredList = filteredList.filter((task) => {
          if (!task.start_date) return false;
          const taskDate = new Date(task.start_date).toDateString();
          return taskDate === new Date(selectedDate).toDateString();
        });
      }

      if (selectedTaskStatus !== "all") {
        if (isOverdueFilter) {
          filteredList = filteredList.filter((task) => {
            const isCompleted = String(task.status_id) === "3";
            const hasDueDate = !!task.due_date;
            const isOverdue = hasDueDate && new Date(task.due_date) < new Date();

            return !isCompleted && isOverdue;
          });
        } else {
          filteredList = filteredList.filter(
            (task) => String(task.status_id) === selectedTaskStatus
          );
        }
      }


      // Only include non-empty task lists, or all if search is empty
      if (
        filteredList.length > 0 ||
        (!searchTask &&
          selectedTaskType === "all" &&
          selectedTaskPriority === "all" &&
          selectedTaskStatus === "all" &&
          selectedTargetId === undefined)
      ) {
        acc[status] = filteredList;
      }

      return acc;
    }, {} as typeof tasks);



    // Overdue
    if (isOverdueFilter) {
      const overdueTasks = Object.values(filteredTasks).flat();
      return [
        {
          status_id: "4",
          title: "Overdue",
          separatorColor: "bg-red-500",
          tasks: overdueTasks,
        },
      ];
    }

    return Object.entries(filteredTasks).map(([status, taskList]) => ({
      status_id: status,
      title: statusTitleMap[status],
      separatorColor: separatorColorMap[status],
      tasks: taskList,
    }));
  }, [tasks, searchTask, selectedTaskType, selectedTaskPriority, selectedTaskStatus, selectedTargetId, selectedTaskId]);


  /*************** End - Grid View Data ******************/


  /*************** Start - Table View Data ******************/
  const rowData = useMemo(() => {

    const lowerSearch = searchTask.toLowerCase();
    const isOverdueFilter = selectedTaskStatus === "4";

    return Object.values(tasks)
      .flat()
      .filter((task) => {

        // Filter each list based on title, description, or owner name
        const matchSearch =
          task.title.toLowerCase().includes(lowerSearch) ||
          task.description?.toLowerCase().includes(lowerSearch);

        if (!matchSearch) return false;

        // Task Type Filter
        if (selectedTaskType === "target" && (task.target_id == null)) return false;
        if (selectedTaskType === "general" && (task.target_id != null)) return false;

        if (selectedTargetId !== undefined && selectedTargetId !== "all") {
          if (String(task.target_id) !== String(selectedTargetId)) return false;
        }
        // Priority Filter
        if (selectedTaskPriority !== "all" && String(task.priority_id) !== selectedTaskPriority) return false;

        // Status filter
        // if (selectedTaskStatus !== "all" && String(task.status_id) !== selectedTaskStatus) return false;
        if (selectedTaskStatus !== "all") {
          if (isOverdueFilter) {
            const isCompleted = String(task.status_id) === "3";
            const hasDueDate = !!task.due_date;
            const isOverdue = hasDueDate && new Date(task.due_date) < new Date();

            // Only return overdue tasks that are not completed
            return !isCompleted && isOverdue;
          } else {
            return String(task.status_id) === selectedTaskStatus;
          }
        }
        // Date filter
        if (selectedDate !== "all") {
          if (!task.start_date) return false;
          const taskDate = new Date(task.start_date).toDateString();
          if (taskDate !== new Date(selectedDate).toDateString()) return false;
        }

        return true;
      });
  }, [tasks, searchTask, selectedTaskType, selectedTaskPriority, selectedTaskStatus, selectedTargetId, selectedDate]);


  const defaultColDef = useMemo(() => {
    return {
      width: 150,
      flex: 1,
      cellStyle: { fontWeight: 'semibold' },
    };
  }, []);

  // Renderer for assignees
  const AssigneesRenderer = ({ value }: any) => {
    return (
      <div className="flex items-center -space-x-2">
        {value?.map((person: any) => (
          <Tooltip key={person.id}>
            <TooltipTrigger asChild>
              <div className="relative z-0 hover:z-10 transition-all duration-200">
                <Avatar className="w-6 h-6 shadow-lg transition-transform duration-200 cursor-pointer">
                  {person.avatar ? (
                    <AvatarImage src={person.avatar}
                    />
                  ) : (
                    <AvatarFallback className={`text-xs font-semibold text-white ${person.bgColor || 'bg-gray-500'}`}>
                      {person.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-sm font-medium">{person.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  };

  // Column Definitions: Defines the columns to be displayed.
  const columnDefs: ColDef<TaskType>[] = [

    { field: 'title', headerName: 'Task' },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'start_date',
      headerName: 'Start Date',
      sortable: true,
      comparator: dateComparator
    },
    {
      field: 'due_date',
      headerName: 'Due Date',
      sortable: true,
      comparator: dateComparator
    },
    {
      headerName: 'Members',
      field: 'assignees',
      sortable: false,
      cellRenderer: AssigneesRenderer,
      cellStyle: { display: 'flex', alignItems: 'center' },
      valueFormatter: (params: any) => { // Prevents the AG Grid error.
        return params.value?.map((p: any) => p.name).join(', ') || '';
      },
    },
    {
      headerName: 'Priority',
      field: 'priority_name',
      cellStyle: { display: 'flex', alignItems: 'center' },
      cellRenderer: (params: any) => {
        return (
          <Badge
            className={taskPriorityColorMap[params.data.priority_id]}
            size="xs"
            fontSize="xs"
          >
            {getPriorityIcon(String(params.data.priority_id))}
            {params.data.priority_name}
          </Badge>
        );
      },
    },
    {
      headerName: 'Target Type',
      field: 'target_id',
      cellStyle: { display: 'flex', alignItems: 'center' },
      cellRenderer: (params: any) => {
        const isTarget = !!params.data.target_id;
        const type = isTarget ? "target" : "general";
        const icon = getTaskTypeIcon(type);
        return (
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${targetTypeColorMap[type]
              } mx-auto lg:mx-0`}
          >
            {icon}
            <span>{isTarget ? "Target" : "General"}</span>
          </div>
        );
      },
    },
    {
      headerName: 'Status',
      field: 'status_name',
      cellStyle: { display: 'flex', alignItems: 'center' },
      cellRenderer: (params: any) => {
        return (
          <Badge
            className={taskStatusColorMap[params.data.status_id]}
            size="xs"
            fontSize="xs"
          >
            {params.data.status_name}
          </Badge>
        );
      },
    },
    {
      headerName: 'Action',
      sortable: false,
      cellRenderer: (params: any) => {
        return (
          <Button color='gray' fontSize="xs" size="sm" onClick={() => handleSelectTask(params.data)}>View</Button>
        );
      },
    },
  ];
  /*************** End - Table View Data ******************/

  // const selectItemCustom = "text-xs h-7 py-1 data-[highlighted]:text-blue-500 hover:cursor-pointer";

  const TaskTypeOptions = [
    { label: "All Type", value: "all" },
    { label: "Target", value: "target" },
    { label: "General", value: "general" },
  ];

  const TaskPriorityOption = [
    { label: "All Priority", value: "all" },
    { label: "Low", value: "1" },
    { label: "Medium", value: "2" },
    { label: "High", value: "3" },
  ];

  const TaskStatusOptions = [
    { label: "All Status", value: "all" },
    { label: "Yet to start", value: "1" },
    { label: "In Progress", value: "2" },
    { label: "Complete", value: "3" },
    { label: "Overdue", value: "4" },
  ];


  /* Start - Get Project Targets */
  const getProjectTargets = async (projectId: number) => {
    try {
      const response = await API.get('get_projectsTargets', {
        params: { project_id: projectId }
      });

      if (response.data.success && typeof response.data.targets === 'object') {
        setTargets(response.data.targets);
      }
    } catch (error) {
      toast.error('Failed to fetch projects targets');

    }
  }
  /* End - Get Project Targets */


  const handleSelectTask = (task: TaskType) => {
    dispatch(setSelectedTask(task));
    dispatch(setCallGetTaskApi(true));
    dispatch(setCallGetTaskPriorityApi(true));
    dispatch(setCallGetTaskStatusApi(true));
    dispatch(setShowAddTask(true));
  }
  /************ End - Handle the Select Task ***********/


  /* ####################### Note - START ########################## */

  const noteForm = useForm<AddNoteFormData>({
    defaultValues: {
      target_id: undefined,
      task_id: undefined,
      title: "",
      content: "",
      tags: [],
    },
    resolver: zodResolver(addNoteSchema),
  });

  const watchedTargetId = useWatch({
    control: noteForm.control,
    name: 'target_id',
  });

  const watchedTaskId = useWatch({
    control: noteForm.control,
    name: 'task_id',
  });


  useEffect(() => {
    if (!showAddNote) {
      noteForm.reset({
        target_id: undefined,
        task_id: undefined,
        title: '',
        content: '',
        tags: [],
      });
    }
  }, [showAddNote]);


  /****** Start- Fetch the Tags Option for Note ***********/
  const getAllNotesTag = async () => {
    try {
      const response = await API.get('get_allNoteTag');
      if (response.data.success && Array.isArray(response.data.tag)) {
        setNoteTag(response.data.tag);
      }
    } catch (error) {
      toast.error('Failed to fetch notes tag');
    }
  };
  /****** End- Fetch the Tags Option for Note ***********/


  /****** Start - Handle Add Note Click *********/
  const handleAddNoteClick = (task: TaskType) => {
    setSelectedNoteTask(task);
    dispatch(setShowAddNote(true));
    getAllNotesTag();

  };
  /****** End - Handle Add Note Click *********/


  /****************** Start- Add Note *****************/
  const handleAddNote = async (values: z.infer<typeof addNoteSchema>) => {
    const payload = {
      ...values,
      project_id: selectedProject?.project_id,
      content: values.content,
    };

    // Save Note
    addUpdateNote(payload);

    noteForm.reset();              // Reset after success
    dispatch(setShowAddNote(false));         // Close dialog

    navigate("?page=notes");      // Navigate to notes page
  };


  const addUpdateNote = async (payload: any) => {
    try {
      const res = await API.post("add_UpdateNote", { data: payload });
      if (res.data.success) {
        toast.success(res.data.message);
        if (selectedProject?.project_id) {
          dispatch(setCallGetNoteApi(true));
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Server error occurred");
    }
  };
  /****************** End- Add Note *****************/
  /* ####################### Note - END ########################## */


  return (
    <>
      <div className="flex sm:flex-row flex-col space-y-2.5 sm:space-y-0 p-6 justify-between">
        {/* Header */}
        <div className='flex items-center gap-2 sm:justify-start justify-center'>
          <h5 className='text-gray-700'>Project Tasks</h5>
        </div>

        <div className='flex flex-wrap gap-2 items-center hover:cursor-pointer'>

          {selectedTaskId != 'all' && (
            <Button color="blue" size="md" fontSize="xs"
              onClick={() =>
                setSelectedTaskId('all')
              }
            >
              All Task
            </Button>
          )}

          {selectedTaskId == 'all' && (
            <>
              <div className='hidden lg:flex items-center relative'>
                <div className='absolute pl-3'>
                  <SearchIcon className='size-5 text-gray-400' />
                </div>
                <input
                  id='search_project'
                  type='text'
                  placeholder='Search Task...'
                  className='border rounded-md py-[9px] px-2 pl-10 placeholder-gray-400 focus:outline-none text-xs'
                  onChange={(e) => setSearchTask(e.target.value)}
                />
              </div>
              <div className='lg:hidden border p-2 rounded-md'>
                <SearchIcon className='size-5 text-gray-400' />
              </div>


              <CustomComboboxSelect
                value={selectedTargetId}
                onValueChange={(val) => setSelectedTargetId(val || 'all')}
                options={[{ id: "all", title: "All Targets" }, ...allTargets]}
                className="w-35 py-[9px] px-3 text-xs"
                popoverClassName="min-w-[250px] lg:min-w-[300px]"
                clearable
              />

              <SelectFilterStatus
                options={TaskTypeOptions}
                value={selectedTaskType}
                onChange={(val) => setSelectedTaskType(val ?? "all")}
              />
              <SelectFilterStatus
                options={TaskPriorityOption}
                value={selectedTaskPriority}
                onChange={(val) => setSelectedTaskPriority(val ?? "all")}
              />

              <SelectFilterStatus
                options={TaskStatusOptions}
                value={selectedTaskStatus}
                onChange={(val) => setSelectedTaskStatus(val ?? "all")}
              />

              {/* Grid View */}
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={() => dispatch(setTaskSelectedView('grid'))}
                    className={`w-8 h-8 rounded-sm p-1 cursor-pointer ${selectedTaskView === 'grid' ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                  >
                    <Grid2X2Plus />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Grid View
                </TooltipContent>
              </Tooltip>

              {/* List View */}
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={() => dispatch(setTaskSelectedView('list'))}
                    className={`w-8 h-8 rounded-sm p-1 cursor-pointer ${selectedTaskView === 'list' ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                  >
                    <List />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  List View
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>

      {/* Kanban Board Grid layout*/}
      {selectedTaskView === 'grid' && (
        <div className="px-0 py-1">
          {Array.isArray(columns) && columns.some(col => col.tasks.length > 0) ? (
            <div
              className={`grid px-6 py-1 gap-8
              ${selectedTaskId !== 'all' ||
                  selectedTaskStatus !== 'all' ||
                  selectedDate !== 'all'
                  ? 'grid-cols-1'
                  : 'grid-cols-1 lg:grid-cols-3'
                }`}
            >
              {columns
                .filter(col => selectedTaskStatus === 'all' || col.status_id === selectedTaskStatus)
                .map((column) => (
                  <div key={column.status_id}>
                    {/* Column Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <h6>{column.title}</h6>
                        <span className="font-semibold text-sm text-gray-400">
                          {column.tasks.length}
                        </span>
                      </div>
                      {/* <Grid2X2Plus className="w-8 h-8 rounded-sm p-2 cursor-pointer bg-gray-100 hover:bg-blue-400 hover:text-white text-gray-400" /> */}
                    </div>

                    <Separator className={`${column.separatorColor} my-1.5 py-[1.5px]`} />

                    <div className="py-5 space-y-5">
                      {column.tasks.map((task) => (
                        <Card
                          key={task.id}
                          className="px-3 h-[400px] sm:h-[350px] lg:h-[400px] xl:h-[350px]  hover:border-blue-400"
                        // onClick={() => handleSelectTask(task)}
                        >
                          <CardHeader>
                            <div className='flex justify-between items-center'>
                              <div className="flex space-x-2 flex-wrap gap-y-2">
                                {/* Category Badge */}
                                <Badge
                                  className={targetTypeColorMap[task.target_id ? "target" : "general"]}
                                  size="xs"
                                  fontSize="xs"
                                >
                                  {getTaskTypeIcon(task.target_id ? "target" : "general")}
                                  {task.target_id ? 'Target' : 'General'}
                                </Badge>

                                <Badge
                                  className={`${taskPriorityColorMap[task.priority_id ?? 0]}`}
                                  size="xs"
                                  fontSize="xs"
                                >
                                  {getPriorityIcon(String(task.priority_id))}
                                  {task.priority_name} Priority
                                </Badge>
                              </div>


                              <div className='flex items-center space-x-2'>
                                <SquarePen className='size-8 p-2 rounded-sm cursor-pointer bg-gray-100 hover:bg-blue-400 hover:text-white text-gray-400'
                                  onClick={() => handleSelectTask(task)} />

                                {/* Action Button */}
                                <CustomDropdownMenuWithTooltip
                                  tooltip="More actions"
                                  trigger={
                                    <Grid2X2Plus className="w-8 h-8 rounded-sm p-2 cursor-pointer bg-gray-100 hover:bg-blue-400 hover:text-white text-gray-400" />
                                  }
                                  align="end"
                                  side="bottom"
                                  sideOffset={5}
                                  dropdownLabel="Actions"
                                  className="w-40 text-center"

                                >
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      navigate(`/dashboard?page=targets&target_id=${task.target_id}`);
                                    }}>
                                      <div className="w-full">
                                        View Target
                                      </div>
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddNoteClick(task);
                                    }}>
                                      <div className="w-full">
                                        Add Note
                                      </div>
                                    </DropdownMenuItem>
                                    {/* <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      navigate(`/dashboard?page=notes&target_id=${target.id}`);
                                    }}>
                                      <div className="w-full">
                                        View Notes
                                      </div>
                                    </DropdownMenuItem> */}
                                  </DropdownMenuGroup>
                                </CustomDropdownMenuWithTooltip>
                              </div>

                            </div>

                            <h5 className="mt-2">{task.title}</h5>
                          </CardHeader>

                          <CardContent className="-mt-4">
                            <p className="line-clamp-2 text-gray-500 font-medium text-sm h-10">
                              {task.description}
                            </p>

                            <div className="mt-4 flex flex-wrap justify-center md:justify-between gap-y-2 gap-2">
                              <div className="w-full sm:w-auto border-1 border-dashed rounded-sm py-2 px-4 text-center sm:text-left text-sm">
                                <p className="font-medium">{task.start_date}</p>
                                <p className="text-gray-400 font-semibold">Start Date</p>
                              </div>
                              <div className="w-full sm:w-auto border-1 border-dashed rounded-sm py-2 px-4 text-center sm:text-left text-sm">
                                <p className="font-medium">{task.due_date}</p>
                                <p className="text-gray-400 font-semibold">End Date</p>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="justify-between">
                            <div className="flex -space-x-3">
                              <TooltipProvider>
                                {Array.isArray(task.assignees) &&
                                  task.assignees.map((assignee, index) => (
                                    <Tooltip key={index}>
                                      <TooltipTrigger asChild>
                                        <div className="relative z-0 hover:z-10 transition-all duration-200">
                                          <Avatar className="w-9 h-9 shadow-lg transition-transform duration-200 cursor-pointer">
                                            {assignee.avatar ? (
                                              <AvatarImage src={assignee.avatar} />
                                            ) : (
                                              <AvatarFallback
                                                className={`text-xs font-semibold text-white ${assignee.bgColor || 'bg-gray-500'}`}
                                              >
                                                {assignee.name.charAt(0).toUpperCase()}
                                              </AvatarFallback>
                                            )}
                                          </Avatar>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">
                                        <p className="text-sm font-medium">{assignee.name}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  ))}
                              </TooltipProvider>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-16 text-lg font-medium">
              No Task found
            </div>
          )}
        </div>
      )}

      {/* Kanban Board List layout*/}
      {selectedTaskView === 'list' && (
        <div className='mx-6 p-6 border-2 rounded-md'>
          <div>
            <AgGridReact domLayout="autoHeight" rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} />
          </div>
        </div>
      )}

      {/* Add Note */}
      <AddNoteDialog
        showAddNote={showAddNote}
        noteForm={noteForm}
        handleAddNote={handleAddNote}
        allTargets={allTargets}
        allTasks={allTasks}
        watchedTargetId={watchedTargetId}
        watchedTaskId={watchedTaskId}
        noteTag={noteTag}
        selectedNoteTask={selectedNoteTask}
      />
    </>
  );

};

export default Tasks;