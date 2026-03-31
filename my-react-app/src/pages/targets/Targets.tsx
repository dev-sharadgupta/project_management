import { useEffect, useMemo, useState } from 'react';
import { Crown, Grid2X2Plus, List, SearchIcon, SquarePen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { statusTitleMap, targetPriorityColorMap, targetStatusColorMap } from '@/lib/badgeColor';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import API from '@/lib/axios';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import { setCallGetTargetApi, setTargetSelectedView, setSelectedTarget, setCallGetTargetPriorityApi, setCallGetTargetStatusApi } from '@/store/slices/targetSlice';
import { setLoading, setShowAddTarget, setShowAddTask, setShowAddNote } from '@/store/slices/projectSlice';
import { getPriorityIcon } from '@/utils/getPriorityIcon';
import type { TargetType } from '@/types/target';
import { useDispatch } from 'react-redux';
import { separatorColorMap } from '@/lib/separatorColor';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { dateComparator } from '@/lib/dateHelper';
import SelectFilterStatus from '@/components/select/SelectFilterStatus';
import { CustomDropdownMenuWithTooltip } from '@/components/dropdown/CustomDropdownMenuWithTooltip';
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useNavigate, useSearchParams } from 'react-router';
import { setSelectedTask } from '@/store/slices/taskSlice';
import type { User } from '@/types/user';
import AddTaskDrawer from '../dashboard/components/AddTaskDrawer';
import type { TaskPriorityType, TaskStatusType, TaskType } from '@/types/task';
import AddNoteDialog from '../dashboard/components/AddNoteDialog';
import { useForm, useWatch } from 'react-hook-form';
import { addNoteSchema, type AddNoteFormData } from '../dashboard/core/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { setCallGetNoteApi } from '@/store/slices/noteSlice';
import type z from 'zod';
import type { NoteTagType } from '@/types/note';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Targets = () => {
  const { callGetTargetApi } = useAppSelector(state => state.target);
  const { selectedProject } = useAppSelector(state => state.project);
  const [targets, setTargets] = useState<Record<string, TargetType[]>>({});
  const allTargets = Object.values(targets).flat();
  const dispatch = useDispatch()
  // const selectItemCustom = "text-xs h-7 py-1 data-[highlighted]:text-blue-500 hover:cursor-pointer";
  const selectedTargetView = useSelector(
    (state: RootState) => state.target?.selectedTargetView ?? 'grid'
  );
  const [searchTarget, setSearchTarget] = useState('');
  const [selectedTargetPriority, setSelectedTargetPriority] = useState<string>("all");
  const [selectedTargetStatus, setSelectedTargetStatus] = useState<string>("all");
  const navigate = useNavigate();
  const [taskAvailableUser, setTaskAvailableUser] = useState<User[]>([]);
  const showAddTask = useAppSelector(state => state.project.showAddTask)
  const [taskPriority, setTaskPriority] = useState<TaskPriorityType[]>([]);
  const [taskStatus, setTaskStatus] = useState<TaskStatusType[]>([]);
  const { selectedTask } = useAppSelector(state => state.task);
  const [selectedTaskTarget, setSelectedTaskTarget] = useState<TargetType | null>(null);

  const [searchParams] = useSearchParams();
  const initialTargetId = searchParams.get("target_id") ?? "all";
  const [selectedTargetId, setSelectedTargetId] = useState<number | string>(initialTargetId);
  const showAddNote = useAppSelector(state => state.project.showAddNote)
  const [tasks, setTasks] = useState<Record<string, TaskType[]>>({});
  const allTasks = Object.values(tasks).flat(); /* Get Flat all task */
  const [noteTag, setNoteTag] = useState<NoteTagType[]>([]);
  const [selectedNoteTarget, setSelectedNoteTarget] = useState<TargetType | null>(null);

  useEffect(() => {
    if (searchParams.has("target_id")) {
      dispatch(setTargetSelectedView('grid'));
    }
  }, []);

  /*************** Start - Get The Project Targets ******************/
  const getProjectTargets = async (projectId: number) => {
    try {
      const response = await API.get('get_projectsTargets', {
        params: { project_id: projectId }
      });

      if (response.data.success && typeof response.data.targets === 'object') {
        setLoading(true);
        setTargets(response.data.targets);
      }
    } catch (error) {
      toast.error('Failed to fetch projects targets');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!selectedProject?.project_id) return;

    if (callGetTargetApi) {
      dispatch(setCallGetTargetApi(false));
    }
    getProjectTargets(selectedProject.project_id);
  }, [callGetTargetApi, selectedProject?.project_id, dispatch]);
  /*************** End - Get The Project Targets ******************/



  /*************** Start - Grid View Data ******************/
  const columns = useMemo(() => {
    const lowerSearch = searchTarget.toLowerCase();

    const filteredTargets = Object.entries(targets).reduce((acc, [status, targetList]) => {
      // Filter each list based on title, description, or owner name
      let filteredList = targetList.filter((target) =>
        target.title.toLowerCase().includes(lowerSearch) ||
        target.description?.toLowerCase().includes(lowerSearch) ||
        target.owner_name?.toLowerCase().includes(lowerSearch)
      );

      // Filter by selectedTargetPriority (1 | 2 | 3 | all)
      if (selectedTargetPriority !== "all") {
        filteredList = filteredList.filter(
          (target) => String(target.priority_id) === selectedTargetPriority
        );
      }

      if (selectedTargetStatus !== "all") {
        filteredList = filteredList.filter(
          (target) => String(target.status_id) === selectedTargetStatus
        );
      }

      // Filter by selectedTargetId
      if (selectedTargetId !== undefined && selectedTargetId !== "all") {
        filteredList = filteredList.filter(
          (target) => String(target.id) === String(selectedTargetId)
        );
      }


      if (filteredList.length > 0 || !searchTarget) {
        acc[status] = filteredList;
      }

      return acc;
    }, {} as typeof targets);

    return Object.entries(filteredTargets).map(([status, targetList]) => ({
      status_id: status,
      title: statusTitleMap[status],
      separatorColor: separatorColorMap[status],
      targets: targetList,
    }));
  }, [targets, searchTarget, selectedTargetPriority, selectedTargetStatus, selectedTargetId]);

  /*************** End - Grid View Data ******************/


  /*************** Start - Table View Data ******************/
  const rowData = useMemo(() => {
    const lowerSearch = searchTarget.toLowerCase();

    return Object.values(targets)
      .flat()
      .filter((target) => {

        // Filter each list based on title, description, or owner name
        const matchSearch =
          target.title.toLowerCase().includes(lowerSearch) ||
          target.description?.toLowerCase().includes(lowerSearch) ||
          target.owner_name?.toLowerCase().includes(lowerSearch);

        if (!matchSearch) return false;

        // Priority Filter
        if (selectedTargetPriority !== "all" && String(target.priority_id) !== selectedTargetPriority) return false;

        // Status filter
        if (selectedTargetStatus !== "all" && String(target.status_id) !== selectedTargetStatus) return false;

        return true;
      });
  }, [targets, searchTarget, selectedTargetPriority, selectedTargetStatus]);


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
  const columnDefs: ColDef<TargetType>[] = [

    { field: 'title', headerName: 'Target' },
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
            className={targetPriorityColorMap[params.data.priority_id]}
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
      headerName: 'Owner',
      field: 'owner_name',
      cellStyle: { display: 'flex', alignItems: 'center' },
      cellRenderer: (params: any) => {
        return (
          <div className="flex flex-row items-center text-center justify-center lg:justify-start w-fit px-2 py-1 rounded-full text-xs bg-gradient-to-r from-yellow-100  via-amber-50 to-purple-100 text-yellow-900 font-medium  gap-1 mx-auto lg:mx-0">
            {/* <Crown className="w-3 h-3 text-yellow-600" /> */}
            <span>{params.data.owner_name}</span>
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
            className={targetStatusColorMap[params.data.status_id]}
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
          <Button color='gray' fontSize="xs" size="sm" onClick={() => handleSelectTarget(params.data)} >View</Button>
        );
      },
    },
  ];
  /*************** End - Table View Data ******************/


  const handleSelectTarget = (target: TargetType) => {
    dispatch(setSelectedTarget(target));
    dispatch(setCallGetTargetApi(true));
    dispatch(setCallGetTargetPriorityApi(true));
    dispatch(setCallGetTargetStatusApi(true));
    dispatch(setShowAddTarget(true));
  }
  /************ End - Handle the Select Target ***********/

  const TargetPriorityOption = [
    { label: "All Priority", value: "all" },
    { label: "Low", value: "1" },
    { label: "Medium", value: "2" },
    { label: "High", value: "3" },
  ];

  const TargetStatusOptions = [
    { label: "All Status", value: "all" },
    { label: "Yet to start", value: "1" },
    { label: "In Progress", value: "2" },
    { label: "Complete", value: "3" },
    { label: "Rejected", value: "4" },
  ];

  /****** Start- Fetch the Priority Option for Task ***********/
  const getAllTaskPriorities = async () => {
    try {
      const response = await API.get('get_allTaskPriorities');
      if (response.data.success && Array.isArray(response.data.priority)) {
        setTaskPriority(response.data.priority);
      }
    } catch (error) {
      toast.error('Failed to fetch task priority');
    }
  };
  /****** End- Fetch the Priority Option for Task ***********/

  /****** Start- Fetch the Status Option for Task ***********/
  const getAllTaskStatus = async () => {
    try {
      const response = await API.get('get_allTaskStatus');
      if (response.data.success && Array.isArray(response.data.status)) {
        setTaskStatus(response.data.status);
      }
    } catch (error) {
      toast.error('Failed to fetch task status');
    }
  };
  /****** End- Fetch the Status Option for Task ***********/

  /****** Start- Fetch the Target User ***********/
  const getTasksUsers = async (projectId: number, ownerId: number) => {
    try {
      const response = await API.get('get_TasksUsers', {
        params: {
          project_id: projectId,
          owner_id: ownerId
        }
      });
      if (response.data.success && Array.isArray(response.data.users)) {
        setTaskAvailableUser(response.data.users);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };
  /****** End- Fetch the Task User ***********/

  /*************** Start - Get The Project Tasks ******************/
  const getProjectTasks = async (projectId: number) => {
    try {
      const response = await API.get('get_projectsTasks', {
        params: { project_id: projectId }
      });

      if (response.data.success && typeof response.data.tasks === 'object') {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      toast.error('Failed to fetch projects tasks');
    }
  }
  /*************** Start - Get The Project Tasks ******************/

  /****** Start - Handle Add Task Click *********/
  const handleAddTaskClick = (target: TargetType) => {
    setSelectedTaskTarget(target);
    dispatch(setSelectedTask(null)); /* set null when new task */
    dispatch(setShowAddTask(true));

    if (selectedProject?.project_id) {
      getProjectTargets(selectedProject.project_id);
    }
    getAllTaskPriorities();
    getAllTaskStatus();
    if (selectedProject?.project_id) {
      getTasksUsers(selectedProject.project_id, selectedProject.owner_id);
    }
  };

  const handleTaskCloseDrawer = () => {
    dispatch(setShowAddTask(false));
    dispatch(setSelectedTask(null));

  };
  /****** End - Handle Add Task Click *********/


  /* ####################### Note - START ########################## */

  /****** Start - Handle Add Note Click *********/
  const handleAddNoteClick = (target: TargetType) => {
    setSelectedNoteTarget(target);
    // setSelectedTaskTarget(target);
    dispatch(setShowAddNote(true));
    getAllNotesTag();
    if (selectedProject?.project_id) {
      getProjectTasks(selectedProject.project_id);
    }


  };
  /****** End - Handle Add Note Click *********/



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

  /* ####################### Note - END ########################## */


  return (
    <>
      <div className="flex space-y-2.5 sm:space-y-0 p-6 justify-between">
        {/* Header */}
        <div className='flex items-center gap-2'>
          <h5 className='text-gray-700'>Project Targets</h5>
        </div>


        <div className='flex gap-2 items-center hover:cursor-pointer'>

          {selectedTargetId != 'all' && (
            <Button color="blue" size="md" fontSize="xs"
              onClick={() =>
                setSelectedTargetId('all')
              }
            >
              All Target
            </Button>
          )}

          {selectedTargetId == 'all' && (
            <>
              <div className='hidden lg:flex items-center relative'>
                <div className='absolute pl-3'>
                  <SearchIcon className='size-5 text-gray-400' />
                </div>
                <input
                  id='search_project'
                  type='text'
                  placeholder='Search Target...'
                  className='border rounded-md py-[9px] px-2 pl-10 placeholder-gray-400 focus:outline-none text-xs'
                  onChange={(e) => setSearchTarget(e.target.value)}
                />
              </div>
              <SelectFilterStatus
                options={TargetPriorityOption}
                value={selectedTargetPriority}
                onChange={(val) => setSelectedTargetPriority(val ?? "all")}
              />

              <SelectFilterStatus
                options={TargetStatusOptions}
                value={selectedTargetStatus}
                onChange={(val) => setSelectedTargetStatus(val ?? "all")}
              />
              <div className='lg:hidden border p-2 rounded-md'>
                <SearchIcon className='size-5 text-gray-400' />
              </div>


              {/* Grid View */}
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={() => dispatch(setTargetSelectedView('grid'))}
                    className={`w-8 h-8 rounded-sm p-1 cursor-pointer ${selectedTargetView === 'grid' ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-400'
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
                    onClick={() => dispatch(setTargetSelectedView('list'))}
                    className={`w-8 h-8 rounded-sm p-1 cursor-pointer ${selectedTargetView === 'list' ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-400'
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
      {selectedTargetView === 'grid' && (
        <div className="px-0 py-1">
          {Array.isArray(columns) && columns.some(col => col.targets.length > 0) ? (
            <div
              className={`grid px-6 py-1 gap-8
              ${selectedTargetId !== 'all' ||
                  selectedTargetStatus !== 'all'
                  ? 'grid-cols-1'
                  : 'grid-cols-1 lg:grid-cols-3'
                }`}
            >
              {columns
                .filter(col =>
                  (selectedTargetStatus === 'all' || col.status_id === selectedTargetStatus) &&
                  col.targets.length > 0
                )
                .map((column) => (
                  <div key={column.status_id}>
                    {/* Column Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <h6>{column.title}</h6>
                        <span className="font-semibold text-sm text-gray-400">
                          {column.targets.length}
                        </span>
                      </div>
                      {/* <Grid2X2Plus className="w-8 h-8 rounded-sm p-2 cursor-pointer bg-gray-100 hover:bg-blue-400 hover:text-white text-gray-400" /> */}
                    </div>

                    <Separator className={`${column.separatorColor} my-1.5 py-[1.5px]`} />
                    <div className="py-5 space-y-5">
                      {column.targets.map((target) => (
                        <Card
                          key={target.id}
                          className="relative overflow-visible px-3 h-[380px] sm:h-[330px] lg:h-[420px] xl:h-[330px] hover:border-blue-400"
                        // onClick={() => handleSelectTarget(target)}
                        >

                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <Badge
                                className={`${targetPriorityColorMap[target.priority_id ?? 0]}`}
                                size="xs"
                                fontSize="xs"
                              >
                                {getPriorityIcon(String(target.priority_id))}
                                {target.priority_name} Priority
                              </Badge>

                              <div className='flex items-center space-x-2'>
                                <SquarePen className='size-8 p-2 rounded-sm cursor-pointer bg-gray-100 hover:bg-blue-400 hover:text-white text-gray-400'
                                  onClick={() => handleSelectTarget(target)} />
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
                                      e.stopPropagation();
                                      handleAddTaskClick(target);
                                    }}>
                                      <div className="w-full">
                                        Add Task
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      navigate(`/dashboard?page=tasks&target_id=${target.id}`);
                                    }}>
                                      <div className="w-full">
                                        View Tasks
                                      </div>
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddNoteClick(target);
                                    }}>
                                      <div className="w-full">
                                        Add Note
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      navigate(`/dashboard?page=notes&target_id=${target.id}`);
                                    }}>
                                      <div className="w-full">
                                        View Notes
                                      </div>
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>
                                </CustomDropdownMenuWithTooltip>

                              </div>
                            </div>
                            <h5 className="mt-1">{target.title}</h5>
                          </CardHeader>

                          <CardContent className="-mt-4">
                            <p className="line-clamp-2 text-gray-500 font-medium text-sm h-10">
                              {target.description}
                            </p>
                            <div className="flex flex-row items-center justify-center lg:justify-start mt-3 w-fit px-2 py-1 rounded-full text-xs bg-gradient-to-r from-yellow-100 via-amber-50 to-purple-100 text-yellow-900 font-medium gap-1 mx-auto lg:mx-0">
                              <Crown className="w-3 h-3 text-yellow-600" />
                              <span>{target.owner_name} (Owner)</span>
                            </div>

                            <div className="mt-4 flex flex-wrap justify-center md:justify-between gap-y-2 gap-2">
                              <div className="w-full sm:w-auto border-1 border-dashed rounded-sm py-2 px-4 text-center sm:text-left text-sm">
                                <p className="font-medium">{target.start_date}</p>
                                <p className="text-gray-400 font-semibold">Start Date</p>
                              </div>
                              <div className="w-full sm:w-auto border-1 border-dashed rounded-sm py-2 px-4 text-center sm:text-left text-sm">
                                <p className="font-medium">{target.due_date}</p>
                                <p className="text-gray-400 font-semibold">End Date</p>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="justify-between">
                            <div className="flex -space-x-3">
                              <TooltipProvider>
                                {Array.isArray(target.assignees) &&
                                  target.assignees.map((assignee, index) => (
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
              No Target found
            </div>
          )}
        </div>
      )}

      {/* Kanban Board List layout*/}
      {selectedTargetView === 'list' && (
        <div className='mx-6 p-6 border-2 rounded-md'>
          <div>
            <AgGridReact domLayout="autoHeight" rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} />
          </div>
        </div>
      )}

      {/* Open the Add Task Drawer */}
      <AddTaskDrawer
        open={showAddTask}
        handleTaskCloseDrawer={handleTaskCloseDrawer}
        taskPriority={taskPriority}
        taskStatus={taskStatus}
        taskAvailableUser={taskAvailableUser}
        targets={allTargets}
        selectedTask={selectedTask}
        selectedTaskTarget={selectedTaskTarget}
      />

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
        selectedNoteTarget={selectedNoteTarget}
      />
    </>
  );
};

export default Targets;