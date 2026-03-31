import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    SheetClose,
} from "@/components/ui/sheet"
import { format } from "date-fns"
import { CheckIcon, ChevronDown, SearchIcon, X } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { z } from "zod";
import { addTargetSchema, type AddTargetFormData } from "../core/schema";
import { useAppSelector } from "@/store/hooks";
import API from "@/lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { setCallGetTargetApi } from "@/store/slices/targetSlice";
import { useDispatch } from "react-redux";
import type { TargetType } from "@/types/target";
import { SheetWrapper } from "@/components/sheet/SheetWrapper";
import { SelectPriority } from "@/components/select/SelectPriority";
import { SelectStatus } from "@/components/select/SelectStatus";
import { DatePopover } from "@/components/date/DatePopover";

interface AddTargetProps {
    open: boolean;
    handleTargetCloseDrawer: () => void;
    targetPriority: any[];
    targetStatus: any[];
    targetAvailableUser: any[];
    selectedTarget?: TargetType | null;
}

const AddTargetDrawer = ({
    open,
    handleTargetCloseDrawer,
    targetPriority,
    targetStatus,
    targetAvailableUser,
    selectedTarget,
}: AddTargetProps) => {

    const [targetTitle, setTargetTitle] = useState<string>('');
    const [targetDescription, setTargetDescription] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date>()
    const [selectedPriority, setSelectedPriority] = useState<string>('2');
    const [selectedStatus, setSelectedStatus] = useState<string>('1');
    const [targetErrors, setTargetErrors] = useState<Record<string, string>>({});
    const [selectedTargetUsers, setSelectedTargetUsers] = useState<any[]>([]);
    const [searchTargetUser, setSearchTargetUser] = useState('');
    const [targetAssigneePopoverOpen, setTargetAssigneePopoverOpen] = useState(false);
    const [targetOwnerPopoverOpen, setTargetOwnerPopoverOpen] = useState(false);
    const [searchTargetOwner, setSearchTargetOwner] = useState('');
    const [selectedTargetOwner, setSelectedTargetOwner] = useState<any | null>(null);
    const { selectedProject } = useAppSelector(state => state.project);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const isMobile = useIsMobile();
    const visibleUser = isMobile ? 2 : 5;
    const isEditMode = selectedTarget !== null;

    /******** Start- Set the Project Owner as Target owner by default, when add the target ****/
    useEffect(() => {
        if (!selectedTargetOwner && targetAvailableUser.length && selectedProject?.owner_id) {
            const owner = targetAvailableUser.find(user => user.id === selectedProject.owner_id);
            if (owner) {
                setSelectedTargetOwner(owner);
            }
        }
    }, [selectedProject?.owner_id, targetAvailableUser, selectedTargetOwner]);
    /******** End- Set the Project Owner as Target owner by default, when add the target ****/

    /********** Start - Reset the users when owner change  **************/
    useEffect(() => {
        // Only clear users if we're creating (not editing)
        if (!isEditMode && selectedTargetOwner) {
            setSelectedTargetUsers([]);
        }
    }, [selectedTargetOwner, isEditMode]);
    /********** End - Reset the users when owner change  **************/


    /****************** Start- Filter Target Owner & User *****************/
    const filteredTargetOwner = targetAvailableUser.filter(user =>
        (user.full_name?.toLowerCase() || '').includes(searchTargetOwner.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTargetOwner.toLowerCase())
    );

    const availableTargetAssignees = filteredTargetOwner.filter(user =>
        selectedTargetOwner ? user.id !== selectedTargetOwner.id : true
    );
    /****************** End- Filter Target Owner & User *****************/


    /****************** Start- Add Target *****************/
    const handleAddTarget = () => {
        const formData: Partial<AddTargetFormData> = {
            title: targetTitle,
            description: targetDescription,
            priority: selectedPriority,
            status: selectedStatus,
            startDate: startDate,
            endDate: endDate,
            ownerId: selectedTargetOwner.id,
        };

        try {
            const validatedData: AddTargetFormData = addTargetSchema.parse(formData);

            const payload = {
                ...validatedData,
                target_id: selectedTarget?.id, /* Edit mode */
                startDate: format(validatedData.startDate, "yyyy-MM-dd"),
                endDate: format(validatedData.endDate, "yyyy-MM-dd"),
                owner_id: selectedTargetOwner.id,
                project_id: selectedProject?.project_id,
                userIds: selectedTargetUsers?.map(user => user.id) || [],
            };

            /* Save  */
            addUpdateTarget(payload);

            // Clear targetErrors if validation passes
            setTargetErrors({});

            // Close the dialog and reset form
            handleTargetCloseDrawer();
            resetTargetForm();

            navigate('?page=targets'); /* Navigate to target page after save */
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle validation targetErrors
                const formattedErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    const field = err.path.join('.');
                    formattedErrors[field] = err.message;
                    console.log(`${field}: ${err.message}`);
                });
                setTargetErrors(formattedErrors);
            }
        }

    };

    const addUpdateTarget = async (payload: any) => {
        try {
            const res = await API.post("add_UpdateTarget", { data: payload });
            if (res.data.success) {
                toast.success(res.data.message);
                if (selectedProject?.project_id) {

                    // Clear targetErrors if validation passes
                    setTargetErrors({});

                    // Reset the form after save
                    resetTargetForm();

                    dispatch(setCallGetTargetApi(true));
                }
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Server error occurred");
        }
    };
    /****************** Start- Add Target *****************/


    /**** Start -  Handle the Selected Project User (Select/Deselect) ***/
    const handleTargetUserToggle = (user: any) => {
        setSelectedTargetUsers(prev => {
            const isSelected = prev.find(u => u.id === user.id);
            if (isSelected) {
                return prev.filter(u => u.id !== user.id);
            } else {
                return [...prev, user];
            }
        });
    };
    /**** End -  Handle the Selected Project User (Select/Deselect) ***/

    /****************** Start- Reset Target Form *****************/
    const resetTargetForm = () => {
        setTargetTitle('');
        setTargetDescription('');
        setSelectedPriority('2');
        setSelectedStatus('1');
        setStartDate(undefined);
        setEndDate(undefined);
        setSelectedTargetUsers([]);
        setTargetErrors({});
        setSelectedTargetOwner(selectedTargetOwner.id);
    };
    /****************** End- Reset Target Form *****************/


    // Effect to populate form when editing
    useEffect(() => {
        if (isEditMode && selectedTarget) {
            setTargetTitle(selectedTarget.title || '');
            setTargetDescription(selectedTarget.description || '');
            setSelectedPriority(selectedTarget.priority_id?.toString() || '2');
            setSelectedStatus(selectedTarget.status_id?.toString() || '1');
            setStartDate(
                selectedTarget.start_date ? new Date(selectedTarget.start_date) : undefined
            );
            setEndDate(
                selectedTarget.due_date ? new Date(selectedTarget.due_date) : undefined
            );
            if (selectedTarget.owner_id) {
                const owner = targetAvailableUser.find(user => user.id === selectedTarget.owner_id);
                if (owner) {
                    setSelectedTargetOwner(owner);
                }
            }
            if (selectedTarget?.assignees?.length > 0 && targetAvailableUser.length > 0) {
                const matchingAssignees = targetAvailableUser.filter(user =>
                    selectedTarget.assignees.some(assignee => assignee.id === user.id)
                );
                setSelectedTargetUsers(matchingAssignees);
            }
        }
    }, [isEditMode, selectedTarget, targetAvailableUser]);


    useEffect(() => {
        if (!isEditMode || !selectedTarget) {
            setTargetTitle('');
            setTargetDescription('');
            setSelectedPriority('2');
            setSelectedStatus('1');
            setStartDate(undefined);
            setEndDate(undefined);
            setSelectedTargetOwner(undefined);
            setSelectedTargetUsers([]);
        }
    }, [isEditMode, selectedTarget]);

    return (
        <SheetWrapper
            open={open}
            onClose={handleTargetCloseDrawer}
            title={(isEditMode ? "Edit " : "Add ") + "Target"}
            description="Manage high-level project objectives and milestones."
            size="xl"
            footer={
                <div className="flex flex-col justify-end w-full gap-2">
                    <Button color="green" onClick={handleAddTarget}>{(isEditMode ? "Edit " : "Add ") + "Target"}</Button>
                    <SheetClose asChild>
                        <Button variant="outline" onClick={resetTargetForm}>Close</Button>
                    </SheetClose>
                </div>
            }
        >
            {/* Content */}
            <div className="grid flex-1 auto-rows-min gap-6 px-4">

                <div className="grid gap-3">
                    <Label htmlFor="target_title">Target Title  <span className="text-red-500">*</span></Label>
                    <input id="target_title" placeholder="Enter Target Ttile"
                        className="py-2 px-4 border rounded-md placeholder:text-sm"
                        value={targetTitle}
                        onChange={(e) => setTargetTitle(e.target.value)}
                        autoComplete="off"

                    />
                    {targetErrors.title && (
                        <span className="text-red-500 text-sm">{targetErrors.title}</span>
                    )}
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="target_description">Description <span className="text-red-500">*</span></Label>
                    <textarea id="target_description" placeholder="Describe the target objectives, requirements, and expected outcomes..." className="border rounded-md py-2 px-4 placeholder:text-sm"
                        value={targetDescription}
                        onChange={(e) => setTargetDescription(e.target.value)}
                        autoComplete="off"

                    />
                    {targetErrors.description && (
                        <span className="text-red-500 text-sm">{targetErrors.description}</span>
                    )}

                </div>
                <div className="grid gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className='sm:w-1/2 space-y-2 w-full'>
                            <Label htmlFor="task_priority">Target Priority  <span className="text-red-500">*</span></Label>
                            <SelectPriority
                                value={selectedPriority}
                                onValueChange={setSelectedPriority}
                                options={targetPriority}
                            />
                            {targetErrors.priority && (
                                <span className="text-red-500 text-sm">{targetErrors.priority}</span>
                            )}
                        </div>
                        <div className='sm:w-1/2 space-y-2 w-full'>
                            <Label htmlFor="task_status">Task Status <span className="text-red-500">*</span></Label>
                            <SelectStatus
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                                options={targetStatus}
                            />
                            {targetErrors.status && (
                                <span className="text-red-500 text-sm">{targetErrors.status}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className='sm:w-1/2 space-y-2 w-full'>
                            <Label htmlFor="task_start_date">Start Date <span className="text-red-500">*</span></Label>
                            <DatePopover
                                date={startDate}
                                onChange={setStartDate}
                                label="Start Date"
                            />
                            {targetErrors.startDate && (
                                <span className="text-red-500 text-sm">{targetErrors.startDate}</span>
                            )}
                        </div>
                        <div className='sm:w-1/2 space-y-2 w-full'>
                            <Label htmlFor="task_end_date">End Date <span className="text-red-500">*</span></Label>
                            <DatePopover
                                date={endDate}
                                onChange={setEndDate}
                                label="End Date"
                            />
                            {targetErrors.endDate && (
                                <span className="text-red-500 text-sm">{targetErrors.endDate}</span>
                            )}
                        </div>
                    </div>
                </div>
                {/* Target Owner */}
                <div className="grid grid-col-12 gap-3">
                    <Label htmlFor="owner">Project Owner <span className="text-red-500">*</span></Label>
                    <Popover open={!isEditMode ? targetOwnerPopoverOpen : false} onOpenChange={setTargetOwnerPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full h-12 justify-between ${isEditMode ? "cursor-not-allowed bg-muted/50 text-muted-foreground" : ""
                                    }`}
                            >
                                {selectedTargetOwner ? (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6" key={selectedTargetOwner?.id}>
                                            {selectedTargetOwner?.image && selectedTargetOwner?.image.trim() !== "" ? (
                                                <AvatarImage src={selectedTargetOwner?.image} alt={selectedTargetOwner?.full_name} />
                                            ) : (
                                                <AvatarFallback className="text-xs font-medium bg-black text-white flex items-center justify-center">
                                                    {selectedTargetOwner?.full_name?.charAt(0) || ""}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <span className="text-sm">{selectedTargetOwner?.full_name}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-500 font-normal">Select Owner</span>
                                )}
                                <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className={`${!open ? "hidden" : ""} w-[400px] p-0`}
                            forceMount
                        >
                            <div className="w-full">
                                {/* Sticky Search */}
                                <div className="sticky top-0 z-10 bg-white px-4 py-2 border-b">
                                    <div className="relative flex items-center bg-gray-100 rounded-md h-10">
                                        <SearchIcon className="absolute left-2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search by username, full name or email..."
                                            value={searchTargetOwner}
                                            onChange={(e) => setSearchTargetOwner(e.target.value)}
                                            className="w-full pl-8 pr-2 py-2 text-sm font-medium text-gray-700 bg-transparent focus:outline-none rounded-md"
                                        />
                                    </div>
                                </div>

                                <div
                                    className="overflow-y-auto max-h-60 px-2 py-1"
                                    onWheel={(e) => {
                                        // Prevent event bubbling to parent components
                                        e.stopPropagation();
                                    }}
                                    onTouchMove={(e) => {
                                        // Prevent event bubbling for touch events
                                        e.stopPropagation();
                                    }}
                                >
                                    {filteredTargetOwner.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
                                            onClick={() => {
                                                setSelectedTargetOwner(user);
                                                setTargetOwnerPopoverOpen(false);
                                            }}
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
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{user.full_name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                    ))}

                                    {filteredTargetOwner.length === 0 && (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            No users found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    {targetErrors.ownerId && (
                        <span className="text-red-500 text-sm">{targetErrors.ownerId}</span>
                    )}
                </div>

                {/* Target Assignee */}
                <div className="grid grid-col-12 gap-3">
                    <Label htmlFor="users">Target Users</Label>
                    <Popover open={targetAssigneePopoverOpen} onOpenChange={setTargetAssigneePopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full min-h-12 justify-between"
                                disabled={!selectedTargetOwner}
                            >
                                <div className="flex items-center gap-2">
                                    {selectedTargetUsers.length > 0 ? (
                                        <>
                                            {selectedTargetUsers.slice(0, visibleUser).map((user) => (
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
                                            {selectedTargetUsers.length > visibleUser && (
                                                <span className="text-xs text-gray-500">+{selectedTargetUsers.length - visibleUser} more</span>
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
                                            value={searchTargetUser}
                                            onChange={(e) => setSearchTargetUser(e.target.value)}
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

                                    {availableTargetAssignees.map((user) => {
                                        const isSelected = selectedTargetUsers.some(u => u.id === user.id);
                                        return (
                                            <div
                                                key={user.id}
                                                className={`flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors ${isSelected ? 'bg-blue-50 border border-blue-200' : ''
                                                    }`}
                                                onClick={() => handleTargetUserToggle(user)}
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
                                    {availableTargetAssignees.length === 0 && (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            No user found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    {selectedTargetUsers.length > 0 && (
                        <div className="">
                            <p className="text-gray-500 mb-2 text-sm">Selected : {selectedTargetUsers.length} user{selectedTargetUsers.length !== 1 ? 's' : ''}</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedTargetUsers.map((user) => (
                                    <span
                                        key={user.id}
                                        className="rounded-full text-xs px-2 py-1 bg-blue-100 text-blue-800 flex items-center gap-1">
                                        {user.full_name}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTargetUserToggle(user);
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
            </div>
        </SheetWrapper>
    );
};

export default AddTargetDrawer;
