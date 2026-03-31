import { Crown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MenuBar from "./MenuBar"
import { useAppSelector } from '@/store/hooks';
import { projectStatusColorMap } from "@/lib/badgeColor";
import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { toast } from "sonner"
import AddUserDialog from "./AddUserDialog";
import ProjectUserDialog from "./ProjectUserDialog";
import { useDispatch } from "react-redux";
import { setShowAddNote, setShowAddTarget, setShowAddTask } from "@/store/slices/projectSlice";
import { getRandomColor } from "@/lib/customHelper";
import type { TargetPriorityType, TargetStatusType } from "@/types/target";
import type { TaskPriorityType, TaskStatusType, TaskType } from "@/types/task";
import { setCallGetTargetApi, setCallGetTargetPriorityApi, setCallGetTargetStatusApi, setSelectedTarget } from "@/store/slices/targetSlice";
import AddTargetDrawer from "./AddTargetDrawer";
import AddTaskDrawer from "./AddTaskDrawer";
import { setCallGetTaskApi, setCallGetTaskPriorityApi, setCallGetTaskStatusApi, setSelectedTask } from "@/store/slices/taskSlice";
import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { addNoteSchema, type AddNoteFormData } from "../core/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch } from 'react-hook-form';
import type { NoteTagType } from "@/types/note";
import type z from "zod";
import { CustomDropdownMenuWithTooltip } from "@/components/dropdown/CustomDropdownMenuWithTooltip";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { setCallGetNoteApi } from "@/store/slices/noteSlice";
import AddNoteDialog from "./AddNoteDialog";

const Header = () => {

    /* Make Inter face for User */
    interface User {
        id: number;
        full_name: string;
        email: string;
        image: string;
    }

    const dispatch = useDispatch();
    const showAddTarget = useAppSelector(state => state.project.showAddTarget)
    const showAddTask = useAppSelector(state => state.project.showAddTask)
    const showAddNote = useAppSelector(state => state.project.showAddNote)

    const { selectedProject } = useAppSelector(state => state.project);
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [searchUser, setSearchUser] = useState('');
    const [selectedUser, setSelectedUser] = useState<User[]>([]);
    const [projectUser, setProjectUser] = useState<User[]>([]);
    const [showProjectUserDialog, setShowProjectUserDialog] = useState(false);
    const [targetPriority, setTargetPriority] = useState<TargetPriorityType[]>([]);
    const [taskPriority, setTaskPriority] = useState<TaskPriorityType[]>([]);
    const [targetStatus, setTargetStatus] = useState<TargetStatusType[]>([]);
    const [taskStatus, setTaskStatus] = useState<TaskStatusType[]>([]);
    const [targetAvailableUser, setTargetAvailableUser] = useState<User[]>([]);
    const [taskAvailableUser, setTaskAvailableUser] = useState<User[]>([]);
    const maxVisible = 4;
    const visibleAvatars = projectUser?.slice(0, maxVisible) || [];
    const extraCount = (projectUser?.length ?? 0) - maxVisible;
    const { selectedTarget, callGetTargetApi } = useAppSelector(state => state.target);
    const [targets, setTargets] = useState([]);
    const allTargets = Object.values(targets).flat(); /* Get Flat all target */

    const { selectedTask, callGetTaskApi } = useAppSelector(state => state.task);
    const [tasks, setTasks] = useState<Record<string, TaskType[]>>({});
    const allTasks = Object.values(tasks).flat(); /* Get Flat all task */
    const [noteTag, setNoteTag] = useState<NoteTagType[]>([]);

    const [searchParams] = useSearchParams();
    const currentPage = searchParams.get("page") || "overview";
    const navigate = useNavigate();

    /****************** Start- Add Note *****************/
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

    /* Start - Fetch the Project Available User */
    const getProjectAvailableUsers = async (projectId: number) => {
        try {
            const response = await API.get('get_projectAvailableUsers', {
                params: { project_id: projectId }
            });
            if (response.data.success && Array.isArray(response.data.users)) {
                setUsers(response.data.users);
                if (projectUser && projectUser.length > 0) {
                    const preSelectedUsers = response.data.users.filter((user: User) =>
                        projectUser.some(projectAssignee => projectAssignee.id === user.id)
                    );
                    setSelectedUser(preSelectedUsers);
                } else {
                    setSelectedUser([]);
                }
            }
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    /* Fetch the User When Dialog box open or Project Switch */
    useEffect(() => {
        if (showAddUserDialog && selectedProject?.project_id) {
            getProjectAvailableUsers(selectedProject.project_id);
        }
    }, [showAddUserDialog, selectedProject?.project_id]);
    /* End - Fetch the Project Available User */


    /* Start  - Filter User - When Search */
    const filteredUsers = users.filter(user =>
        (user.full_name?.toLowerCase() || '').includes(searchUser.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchUser.toLowerCase())
    );
    /* End  - Filter User - When Search */


    /* Start - Handle the Selected Project User (Select/Deselect) */
    const handleUserToggle = (user: any) => {
        setSelectedUser(prev => {
            const isSelected = prev.find(u => u.id === user.id);
            if (isSelected) {
                return prev.filter(u => u.id !== user.id);
            } else {
                return [...prev, user];
            }
        });
    };
    /* End - Handle the Selected Project User (Select/Deselect) */


    /* Start - Save the Project Users */
    const handleConfirm = async () => {
        try {
            const payload = selectedUser.map(user => ({
                user_id: user.id,
                project_id: selectedProject?.project_id,
            }));

            const res = await API.post("save_projectUsers", { data: payload });
            if (res.data.success) {
                toast.success(res.data.message);
                setShowAddUserDialog(false);
                if (selectedProject?.project_id) {
                    setSelectedUser([]);
                    setSearchUser('');
                    fetchProjectAssignee(selectedProject.project_id); // Re-fetch after saving
                }
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Server error occurred");
        }
    };
    /* End - Save the Project Users */


    /* Start - Cancel the Project User Selection */
    const handleCancel = () => {
        setSelectedUser([]);
        setSearchUser('');
        setShowAddUserDialog(false);
    };
    /* End - Cancel the Project User Selection */


    /* Start - Remove All Users from Project */
    const handleRemoveAllUser = async () => {
        try {
            const res = await API.post("remove_allProjectUsers", { project_id: selectedProject?.project_id });
            if (res.data.success) {
                toast.success(res.data.message);
                setShowAddUserDialog(false);
                if (selectedProject?.project_id) {
                    setSelectedUser([]);
                    setSearchUser('');
                    fetchProjectAssignee(selectedProject.project_id); // Re-fetch after saving
                }
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Server error occurred");
        }
    };

    /* Call the function when load or switch project */
    useEffect(() => {
        if (selectedProject?.project_id) {
            fetchProjectAssignee(selectedProject.project_id);
        }
    }, [selectedProject?.project_id]);

    /* Get The Project Assign User */
    const fetchProjectAssignee = async (projectId: number) => {
        try {
            const response = await API.get('get_projectAssignedUsers', {
                params: { project_id: projectId }
            });
            if (response.data.success && Array.isArray(response.data.users)) {
                setProjectUser(response.data.users);
            }
        } catch (error) {
            toast.error('Failed to fetch Project Assignee');
        }
    };
    /* End - Remove All Users from Project */


    /****** Start -Filter Project User - When Search *********/
    const filteredProjectUsers = projectUser?.filter(user =>
        (user.full_name?.toLowerCase() || '').includes(searchUser.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchUser.toLowerCase())
    );
    /****** End -Filter Project User - When Search *********/


    /****** Start - Handle Add Target Click *********/
    const handleAddTargetClick = () => {
        dispatch(setSelectedTarget(null)); /* set null when new target */
        dispatch(setShowAddTarget(true));
        getAllTargetPriorities();
        getAllTargetStatus();
        if (selectedProject?.project_id) {
            getTargetsUsers(selectedProject.project_id, selectedProject.owner_id);
        }
    };

    const handleTargetCloseDrawer = () => {
        dispatch(setShowAddTarget(false));
        dispatch(setSelectedTarget(null));
    };
    /****** End - Handle Add Target Click *********/


    /****** Start - Handle Add Task Click *********/
    const handleAddTaskClick = () => {
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
    /*************** End - Get The Project Tasks ******************/


    /****** Start - Handle Add Note Click *********/
    const handleAddNoteClick = () => {
        // dispatch(setSelectedTask(null)); /* set null when new note */
        dispatch(setShowAddNote(true));
        if (selectedProject?.project_id) {
            getProjectTargets(selectedProject.project_id);
            getProjectTasks(selectedProject.project_id);
        }
        getAllNotesTag();
    };
    /****** End - Handle Add Note Click *********/


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

    /****** Start- Fetch the Priority Option for Target ***********/
    const getAllTargetPriorities = async () => {
        try {
            const response = await API.get('get_allTargetPriorities');
            if (response.data.success && Array.isArray(response.data.priority)) {
                setTargetPriority(response.data.priority);
            }
        } catch (error) {
            toast.error('Failed to fetch target priority');
        }
    };
    /****** End- Fetch the Priority Option for Target ***********/

    useEffect(() => {
        if (callGetTargetApi) {
            dispatch(setCallGetTargetApi(false));
            dispatch(setCallGetTargetPriorityApi(false));
            dispatch(setCallGetTargetStatusApi(false));
            getAllTargetPriorities();
            getAllTargetStatus();
            if (selectedProject?.project_id) {
                getTargetsUsers(selectedProject.project_id, selectedProject.owner_id);
            }
        }
    }, [callGetTargetApi, dispatch]);


    /****** Start- Fetch the Status Option for Target ***********/
    const getAllTargetStatus = async () => {
        try {
            const response = await API.get('get_allTargetStatus');
            if (response.data.success && Array.isArray(response.data.status)) {
                setTargetStatus(response.data.status);
            }
        } catch (error) {
            toast.error('Failed to fetch target status');
        }
    };
    /****** End- Fetch the Status Option for Target ***********/


    /****** Start- Fetch the Target User ***********/
    const getTargetsUsers = async (projectId: number, ownerId: number) => {
        try {
            const response = await API.get('get_TargetsUsers', {
                params: {
                    project_id: projectId,
                    owner_id: ownerId
                }
            });
            if (response.data.success && Array.isArray(response.data.users)) {
                setTargetAvailableUser(response.data.users);
            }
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };
    /****** End- Fetch the Target User ***********/


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


    useEffect(() => {
        if (callGetTaskApi) {
            dispatch(setCallGetTaskApi(false));
            dispatch(setCallGetTaskPriorityApi(false));
            dispatch(setCallGetTaskStatusApi(false));
            getAllTaskPriorities();
            getAllTaskStatus();
            if (selectedProject?.project_id) {
                getProjectTargets(selectedProject.project_id);
                getTasksUsers(selectedProject.project_id, selectedProject.owner_id);
            }
        }
    }, [callGetTaskApi, dispatch]);

    /** ######################## Notes - Start ############################## */


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


    /** ######################## Notes - End ############################## */


    return (
        <>
            <Card className="w-full rounded-md">
                <CardContent className="flex flex-col lg:flex-row items-start gap-6 py-1">
                    <img className="rounded-md w-24 h-24 lg:w-45 lg:h-40 mx-auto lg:mx-0" src='/profile-img.png' alt="Logo" />
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col lg:flex-row justify-between items-center">
                            <div className="flex justify-start flex-col md:flex-row gap-2 md:w-full w-auto">
                                <div className="flex flex-col w-full ">
                                    <div className="flex flex-col lg:flex-row md:items-center items-center gap-2 py-2 lg:py-0">
                                        <h3>{selectedProject?.title}</h3>

                                        <Badge
                                            className={`${projectStatusColorMap[selectedProject?.project_status ?? 0]}`}
                                            size="xs"
                                            fontSize="xs"
                                        >
                                            {selectedProject?.status_name}
                                        </Badge>
                                    </div>


                                </div>

                            </div>
                            <div className="flex justify-center lg:justify-end items-center w-full gap-2 py-4 lg:py-0">
                                <Button color='gray' fontSize="xs" className="hover:text-blue-500" onClick={() => setShowAddUserDialog(true)}>Add/Edit User</Button>

                                {currentPage === "targets" && (
                                    <Button color="blue" fontSize="xs" onClick={handleAddTargetClick}>Add Target</Button>
                                )}
                                {currentPage === "tasks" && (
                                    <Button color="blue" fontSize="xs" onClick={handleAddTaskClick}>Add Task</Button>
                                )}
                                {currentPage === "notes" && (
                                    <Button color="blue" fontSize="xs" onClick={handleAddNoteClick}>Add Note</Button>
                                )}
                                {currentPage === "meetings" && (
                                    <Button color="blue" fontSize="xs">Add Meeting</Button>
                                )}
                                {currentPage === "reports" && (
                                    <Button color="blue" fontSize="xs">Add Report</Button>
                                )}

                                {/* Action Button */}
                                <CustomDropdownMenuWithTooltip
                                    tooltip="More actions"
                                    trigger={
                                        <Button color='gray' className="hover:text-blue-500"><MoreHorizontal /></Button>
                                        // <Grid2X2Plus className="w-9 h-9 rounded-sm p-2 cursor-pointer bg-gray-100 hover:bg-blue-400 hover:text-white text-gray-400" />
                                    }
                                    align="end"
                                    side="bottom"
                                    sideOffset={5}
                                    dropdownLabel="Actions"
                                    className="w-50 text-center"
                                >
                                    {currentPage != "targets" && (
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddTargetClick();
                                        }}>
                                            <div className="w-full">
                                                Add Target
                                            </div>
                                        </DropdownMenuItem>
                                    )}
                                    {currentPage != "tasks" && (
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddTaskClick();
                                        }}>
                                            <div className="w-full">
                                                Add Task
                                            </div>
                                        </DropdownMenuItem>
                                    )}
                                    {currentPage != "notes" && (
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddNoteClick();
                                        }}>
                                            <div className="w-full">
                                                Add Note
                                            </div>
                                        </DropdownMenuItem>
                                    )}
                                    {/* <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddTargetClick();
                                    }}>
                                       Add Target
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddTargetClick();
                                    }}>
                                       Add Target
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddTargetClick();
                                    }}>
                                       Add Target
                                    </DropdownMenuItem> */}
                                </CustomDropdownMenuWithTooltip>
                                <Button color='gray' className="hover:text-blue-500 hidden"><MoreHorizontal /></Button>
                            </div>
                        </div>

                        {/* <p className="mt-2 text-gray-400 font-semibold text-center lg:text-left">
                            {selectedProject?.summary}
                        </p> */}
                        <p className="mt-2 text-gray-400 font-semibold text-center lg:text-left">
                            {selectedProject?.description}
                        </p>
                        <div className="flex flex-row items-center text-center justify-center lg:justify-start mt-3 w-fit  px-2 py-1 rounded-full text-xs bg-gradient-to-r from-yellow-100  via-amber-50 to-purple-100 text-yellow-900 font-medium  gap-1 mx-auto lg:mx-0">
                            <Crown className="w-3 h-3 text-yellow-600" />
                            <span>{selectedProject?.owner_name} (Owner)</span>
                        </div>
                        {/* <div className="mt-3 flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-0 rounded-lg w-auto">
                            <Avatar className="w-8 h-8 ring-2 ring-blue-400">
                                {selectedProject?.owner_pic ? (
                                    <AvatarImage src={selectedProject?.owner_pic} />
                                ) : (
                                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                                        {selectedProject?.owner_name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-semibold text-gray-800">Project Owner</span>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">{selectedProject?.owner_name}</p>
                            </div>
                        </div> */}

                        <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-y-2">
                            <div className="w-full sm:w-auto border-1 border-dashed rounded-sm py-3 px-4 sm:me-6 text-center sm:text-left">
                                <p className="font-medium">{selectedProject?.start_date}</p>
                                <p className="text-gray-400 font-semibold">Start Date</p>
                            </div>
                            <div className="w-full sm:w-auto border-1 border-dashed rounded-sm py-3 px-4 sm:me-6 text-center sm:text-left">
                                <p className="font-medium">{selectedProject?.end_date}</p>
                                <p className="text-gray-400 font-semibold">End Date</p>
                            </div>

                            {/* <div className="w-full sm:w-auto border-1 border-dashed rounded-sm py-3 px-4 sm:me-6 text-center sm:text-left">
                            <div className="flex justify-center sm:justify-start">
                                <div className="me-1 mt-1">
                                    <ArrowDown className="w-4 h-4 text-red-400" />
                                </div>
                                <div>
                                    <p className="font-medium">75</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 font-semibold">Open Tasks</p>
                            </div>
                        </div> */}
                            {/* <div className="w-full sm:w-auto border-1 border-dashed rounded-sm py-3 px-4 sm:me-6 text-center sm:text-left">
                            <div className="flex justify-center sm:justify-end">
                                <ArrowUp className="w-4 h-4 mt-1 me-2 text-green-400" />
                                <p className="font-medium">$15,000</p>
                            </div>
                            <p className="text-gray-400 font-semibold">Budget Spent</p>
                        </div> */}
                            <div className="flex -space-x-3 items-center py-3 lg:py-0">
                                <TooltipProvider>
                                    {visibleAvatars.map((user, index) => {
                                        const fallbackColor = getRandomColor();

                                        return (

                                            <Tooltip key={index}>
                                                <TooltipTrigger asChild>
                                                    <div className="relative z-0 hover:z-10 transition-all duration-200">
                                                        <Avatar className="w-9 h-9 shadow-lg transition-transform duration-200 cursor-pointer">
                                                            {user?.image ? (
                                                                <AvatarImage src={user.image} />
                                                            ) : (
                                                                <AvatarFallback className={`text-xs font-semibold text-white ${fallbackColor}`}>
                                                                    {user && user?.full_name?.charAt(0).toUpperCase()}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p className="text-sm font-medium">{user.full_name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}

                                    {extraCount > 0 && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="relative z-0 hover:z-10 transition-all duration-200 cursor-pointer" onClick={() => setShowProjectUserDialog(true)}>
                                                    <Avatar className="w-9 h-9 shadow-lg text-white">
                                                        <AvatarFallback className="text-xs font-semibold bg-black text-white">
                                                            +{extraCount}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                <p className="text-sm font-medium">View more User</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <div className="px-6 -mb-6">
                    <Separator className="my-1" />
                    <MenuBar />
                </div>
            </Card>
            {/* Dialog for Show Add User */}
            <AddUserDialog
                open={showAddUserDialog}
                onOpenChange={(open) => {
                    setShowAddUserDialog(open);
                    if (!open) {
                        setSearchUser('');
                        setSelectedUser([]);
                    }
                }}
                searchUser={searchUser}
                setSearchUser={setSearchUser}
                filteredUsers={filteredUsers}
                selectedUser={selectedUser}
                handleUserToggle={handleUserToggle}
                handleCancel={handleCancel}
                handleConfirm={handleConfirm}
                handleRemoveAllUser={handleRemoveAllUser}
            />



            {/* Dialog for Show All Project User */}
            <ProjectUserDialog
                open={showProjectUserDialog}
                onOpenChange={(open) => {
                    setShowProjectUserDialog(open);
                    if (!open) {
                        setSearchUser('');
                    }
                }}
                searchUser={searchUser}
                setSearchUser={setSearchUser}
                filteredProjectUsers={filteredProjectUsers}
            />


            {/* Open the Add Target Drawer */}
            <AddTargetDrawer
                open={showAddTarget}
                handleTargetCloseDrawer={handleTargetCloseDrawer}
                targetPriority={targetPriority}
                targetStatus={targetStatus}
                targetAvailableUser={targetAvailableUser}
                selectedTarget={selectedTarget}
            />

            {/* Open the Add Task Drawer */}
            <AddTaskDrawer
                open={showAddTask}
                handleTaskCloseDrawer={handleTaskCloseDrawer}
                taskPriority={taskPriority}
                taskStatus={taskStatus}
                taskAvailableUser={taskAvailableUser}
                targets={targets}
                selectedTask={selectedTask}
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
            />

        </>
    );
}

export default Header;