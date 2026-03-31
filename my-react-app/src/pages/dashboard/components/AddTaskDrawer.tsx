import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { CheckIcon, ChevronDown, SearchIcon, X } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { z } from "zod";
import { useAppSelector } from "@/store/hooks";
import API from "@/lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDispatch } from "react-redux";
import { SheetWrapper } from "@/components/sheet/SheetWrapper";
import { addTaskSchema, type AddTaskFormData } from "../core/schema";
import { setCallGetTaskApi } from "@/store/slices/taskSlice";
import { SelectPriority } from "@/components/select/SelectPriority";
import { SelectStatus } from "@/components/select/SelectStatus";
import { DatePopover } from "@/components/date/DatePopover";
import { CustomComboboxSelect } from "@/components/select/CustomComboboxSelect";
import { SheetClose } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import type { TaskType } from "@/types/task";
import { CustomFormField } from "@/components/form/CustomFormField";
import type { TargetType } from "@/types/target";
import { zodResolver } from "@hookform/resolvers/zod";

type AddTaskProps = {
    open: boolean;
    handleTaskCloseDrawer: () => void;
    taskPriority?: any[];
    taskStatus?: any[];
    taskAvailableUser: any[];
    targets: any[];
    selectedTask?: TaskType | null;
    selectedTaskTarget?: TargetType | null;
};

const AddTaskDrawer: React.FC<AddTaskProps> = ({
    open,
    handleTaskCloseDrawer,
    taskPriority,
    taskStatus,
    taskAvailableUser,
    targets,
    selectedTask,
    selectedTaskTarget,
}) => {
    const [selectedTaskUsers, setSelectedTaskUsers] = useState<any[]>([]);
    const [searchTaskUser, setSearchTaskUser] = useState('');
    const [taskAssigneePopoverOpen, setTaskAssigneePopoverOpen] = useState(false);
    const { selectedProject } = useAppSelector(state => state.project);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const isMobile = useIsMobile();
    const visibleUser = isMobile ? 2 : 5;
    const allTargets = Object.values(targets).flat(); /* Get Flat all target */
    const isEditMode = selectedTask !== null;


    /****************** Start- Add Task *****************/
    const taskForm = useForm<AddTaskFormData>({
        resolver: zodResolver(addTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "2",
            status: "1",
            startDate: undefined,
            endDate: undefined,
            target_id: undefined,
            userIds: [],
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (open && !selectedTask) {
            // This runs only when opening for a new task
            taskForm.reset({
                title: "",
                description: "",
                priority: "2",
                status: "1",
                startDate: undefined,
                endDate: undefined,
                target_id: selectedTaskTarget?.id || undefined,
                userIds: [],
            });
            setSelectedTaskUsers([]);
        }
    }, [open, selectedTask, selectedTaskTarget?.id, taskForm]);


    const handleAddTask = async (values: z.infer<typeof addTaskSchema>) => {
        const payload = {
            ...values,
            task_id: selectedTask?.id, /* Edit mode */
            startDate: format(values.startDate, "yyyy-MM-dd"),
            endDate: format(values.endDate, "yyyy-MM-dd"),
            project_id: selectedProject?.project_id,
            target_id: values.target_id,
            userIds: selectedTaskUsers?.map((user) => user.id) || [],
        };

        // Save task
        addUpdateTask(payload);
        handleTaskCloseDrawer();

        navigate("?page=tasks");      // Navigate to task page
    };


    const addUpdateTask = async (payload: any) => {
        try {
            const res = await API.post("add_UpdateTask", { data: payload });
            if (res.data.success) {
                toast.success(res.data.message);
                if (selectedProject?.project_id) {

                    // Reset the form after save
                    resetTaskForm();

                    dispatch(setCallGetTaskApi(true));
                }
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Server error occurred");
        }
    };
    /****************** End- Add Task *****************/


    /**** Start -  Handle the Selected Project User (Select/Deselect) ***/
    const handletaskUserToggle = (user: any) => {
        setSelectedTaskUsers(prev => {
            const isSelected = prev.find(u => u.id === user.id);
            if (isSelected) {
                return prev.filter(u => u.id !== user.id);
            } else {
                return [...prev, user];
            }
        });
    };
    /**** End -  Handle the Selected Project User (Select/Deselect) ***/


    /****************** Start- Reset Task Form *****************/
    const resetTaskForm = () => {
        taskForm.reset();
        setSelectedTaskUsers([]);
    };
    /****************** End- Reset Task Form *****************/


    /********** Start - Effect to populate form when editing *****/
    useEffect(() => {
        if (isEditMode && selectedTask) {
            const matchingAssignees = selectedTask.assignees?.length && taskAvailableUser.length
                ? taskAvailableUser.filter(user =>
                    selectedTask.assignees.some(assignee => assignee.id === user.id)
                )
                : [];


            taskForm.reset({
                // type,
                title: selectedTask.title || "",
                description: selectedTask.description || "",
                priority: selectedTask.priority_id?.toString() || "2",
                status: selectedTask.status_id?.toString() || "1",
                startDate: selectedTask.start_date ? new Date(selectedTask.start_date) : undefined,
                endDate: selectedTask.due_date ? new Date(selectedTask.due_date) : undefined,
                target_id:
                    selectedTask.target_id != null ? selectedTask.target_id : undefined,
                userIds: matchingAssignees.map(user => user.id),
            });

            // setTargetType(type);
            setSelectedTaskUsers(matchingAssignees);
        }
    }, [isEditMode, selectedTask, taskAvailableUser, taskForm.reset]);
    /********** End - Effect to populate form when editing *****/


    /********** Start - Reset the users if not edit mode  **************/
    useEffect(() => {
        // Only clear users if we're creating (not editing)
        if (!isEditMode) {
            setSelectedTaskUsers([]);
        }
    }, [isEditMode]);
    /********** End - Reset the users if not edit mode  **************/

    return (

        <SheetWrapper
            open={open}
            onClose={handleTaskCloseDrawer}
            title={(isEditMode ? "Edit " : "Add ") + "Task"}
            description="Manage project Task and low-level milestones."
            size="xl"
        >

            {/* Content */}

            <Form {...taskForm} >
                <form
                    onSubmit={taskForm.handleSubmit(
                        handleAddTask
                    )}>
                    <div className="grid flex-1 auto-rows-min gap-6 px-4">
                        {/* Select Target */}
                        <CustomFormField
                            form={taskForm}
                            name="target_id"
                            label="Select Target"
                            renderInput={(field) => (
                                <CustomComboboxSelect
                                    {...field}
                                    placeholder="Select Target"
                                    value={String(field.value ?? '')}
                                    onValueChange={(val) => {
                                        field.onChange(Number(val));
                                    }}
                                    options={allTargets}
                                    clearable={true}
                                />
                            )}
                        />

                        {/* Task title */}
                        <CustomFormField
                            form={taskForm}
                            name="title"
                            label="Task Title"
                            required
                            renderInput={(field) => (
                                <input
                                    id="task_title"
                                    placeholder="Enter Task Title"
                                    className="py-2 px-4 border rounded-md placeholder:text-sm"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />

                        {/* Description */}
                        <CustomFormField
                            form={taskForm}
                            name="description"
                            label="Task Description"
                            required
                            renderInput={(field) => (
                                <input
                                    id="task_description"
                                    placeholder="Describe the task objectives, requirements, and expected outcomes..."
                                    className="py-2 px-4 border rounded-md placeholder:text-sm"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />


                        <div className="grid gap-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Priority */}
                                <div className='sm:w-1/2 space-y-2 w-full'>
                                    <CustomFormField
                                        form={taskForm}
                                        name="priority"
                                        label="Task Priority"
                                        required
                                        renderInput={(field) => (
                                            <SelectPriority
                                                {...field}
                                                onValueChange={field.onChange}
                                                options={taskPriority}
                                            />
                                        )}
                                    />
                                </div>
                                <div className='sm:w-1/2 space-y-2 w-full'>
                                    <CustomFormField
                                        form={taskForm}
                                        name="status"
                                        label="Task Status"
                                        required
                                        renderInput={(field) => (
                                            <SelectStatus
                                                {...field}
                                                onValueChange={field.onChange}
                                                options={taskStatus}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className='sm:w-1/2 space-y-2 w-full'>
                                    <CustomFormField
                                        form={taskForm}
                                        name="startDate"
                                        label="Start Date"
                                        required
                                        renderInput={(field) => (
                                            <DatePopover
                                                date={field.value}
                                                onChange={field.onChange}
                                                label="Start Date"
                                            />
                                        )}
                                    />
                                </div>
                                <div className='sm:w-1/2 space-y-2 w-full'>
                                    <CustomFormField
                                        form={taskForm}
                                        name="endDate"
                                        label="End Date"
                                        required
                                        renderInput={(field) => (
                                            <DatePopover
                                                date={field.value}
                                                onChange={field.onChange}
                                                label="End Date"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Task Assignee */}
                        <div className="grid grid-col-12 gap-3">
                            <Label htmlFor="users">Assigned To</Label>
                            <Popover open={taskAssigneePopoverOpen} onOpenChange={setTaskAssigneePopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full min-h-12 justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            {selectedTaskUsers.length > 0 ? (
                                                <>
                                                    {selectedTaskUsers.slice(0, visibleUser).map((user) => (
                                                        <div key={user.id} className="flex items-center gap-1 bg-blue-200 text-black rounded-full px-2 py-1">
                                                            <Avatar className="h-4 w-4">
                                                                {user.image ? (
                                                                    <AvatarImage src={user.image} alt={user.full_name} />
                                                                ) : (
                                                                    <AvatarFallback className="text-xs font-medium bg-black text-white">
                                                                        {user.full_name.charAt(0)}
                                                                    </AvatarFallback>
                                                                )}
                                                            </Avatar>
                                                            <span className="text-xs">{user.full_name}</span>
                                                        </div>
                                                    ))}
                                                    {selectedTaskUsers.length > visibleUser && (
                                                        <span className="text-xs text-gray-500">+{selectedTaskUsers.length - visibleUser} more</span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-gray-500 font-normal">Select Users</span>
                                            )}
                                        </div>
                                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    forceMount
                                    className="w-[400px] p-0"
                                >
                                    <div className="w-full">
                                        {/* Sticky Search */}
                                        <div className="sticky top-0 z-10 bg-white px-4 py-2 border-b">
                                            <div className="relative flex items-center bg-gray-100 rounded-md h-10">
                                                <SearchIcon className="absolute left-2 text-gray-500 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    placeholder="Search by username, full name or email..."
                                                    value={searchTaskUser}
                                                    onChange={(e) => setSearchTaskUser(e.target.value)}
                                                    className="w-full pl-8 pr-2 py-2 text-sm font-medium text-gray-700 bg-transparent focus:outline-none rounded-md"
                                                />
                                            </div>
                                        </div>

                                        <div
                                            className="overflow-y-auto max-h-60 px-2 py-1"
                                            onWheel={(e) => {
                                                e.stopPropagation();
                                            }}
                                            onTouchMove={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >

                                            {taskAvailableUser.map((user) => {
                                                const isSelected = selectedTaskUsers.some(u => u.id === user.id);
                                                return (
                                                    <div
                                                        key={user.id}
                                                        className={`flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors ${isSelected ? 'bg-blue-50 border border-blue-200' : ''
                                                            }`}
                                                        onClick={() => handletaskUserToggle(user)}
                                                    >
                                                        <Avatar className="h-8 w-8">
                                                            {user.image ? (
                                                                <AvatarImage src={user.image} alt={user.full_name} />
                                                            ) : (
                                                                <AvatarFallback className="text-xs font-medium bg-black text-white flex items-center justify-center">
                                                                    {user.full_name.charAt(0)}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        <div className="flex flex-col flex-1">
                                                            <span className="text-sm font-medium">{user.full_name}</span>
                                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="flex ml-auto  bg-blue-500 rounded-full">
                                                                <CheckIcon className="w-5 h-5 px-1 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {taskAvailableUser.length === 0 && (
                                                <div className="p-4 text-center text-gray-500 text-sm">
                                                    No user found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            {selectedTaskUsers.length > 0 && (
                                <div className="">
                                    <p className="text-gray-500 mb-2 text-sm">Selected : {selectedTaskUsers.length} user{selectedTaskUsers.length !== 1 ? 's' : ''}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTaskUsers.map((user) => (
                                            <span
                                                key={user.id}
                                                className="rounded-full text-xs px-2 py-1 bg-blue-100 text-blue-800 flex items-center gap-1">
                                                {user.full_name}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handletaskUserToggle(user);
                                                    }}
                                                    className="text-blue-500 hover:text-blue-800 cursor-pointer">
                                                    <X size={14} className="" />
                                                </button>
                                            </span>
                                        )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 left-0 right-0 bg-white border-t px-1 py-4 flex flex-col gap-2 z-10">
                            <Button type="submit" color="green">
                                {(isEditMode ? "Edit " : "Add ") + "Task"}
                            </Button>
                            <SheetClose asChild>
                                <Button variant="outline" onClick={resetTaskForm}>Close</Button>
                            </SheetClose>
                        </div>
                    </div>
                </form>
            </Form>
        </SheetWrapper >
    )
};

export default AddTaskDrawer;
