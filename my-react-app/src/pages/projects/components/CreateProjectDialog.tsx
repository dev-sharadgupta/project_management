import { useState } from 'react';
import { SearchIcon, CalendarIcon, ChevronDown, CheckIcon } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { z } from "zod";
import API from '@/lib/axios'
import { toast } from "sonner"
import { useIsMobile } from '@/hooks/use-mobile';
import { useDispatch } from 'react-redux';
import { setAllProjects } from '@/store/slices/projectSlice';
import { createProjectSchema, type CreateProjectFormData } from '@/pages/dashboard/core/schema';


interface CreateProjectProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    filteredProjectOwner: any[];
    searchOwner: string;
    setSearchOwner: (val: string) => void;
}

const CreateProjectDialog = ({
    open,
    onOpenChange,
    filteredProjectOwner,
    searchOwner,
    setSearchOwner,
}: CreateProjectProps) => {

    // Form state variables
    const [title, setTitle] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date>()
    const [calendarOpenStart, setCalendarOpenStart] = useState(false)
    const [calendarOpenEnd, setCalendarOpenEnd] = useState(false)

    const [selectedOwner, setSelectedOwner] = useState<any | null>(null);
    const [ownerPopoverOpen, setOwnerPopoverOpen] = useState(false);

    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [searchUser, setSearchUser] = useState('');
    const [userAssigneePopoverOpen, setUserAssigneePopoverOpen] = useState(false);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const availableAssignees = filteredProjectOwner.filter(user =>
        selectedOwner ? user.id !== selectedOwner.id : true
    );
    const isMobile = useIsMobile();
    const visibleUser = isMobile ? 2 : 5;
    const dispatch = useDispatch();

    const filteredUsers = availableAssignees.filter(user =>
        (user.full_name?.toLowerCase() || '').includes(searchUser.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchUser.toLowerCase())
    );

    const handleCreate = () => {
        const formData: Partial<CreateProjectFormData> = {
            title: title,
            summary: summary,
            description: description,
            startDate: startDate,
            endDate: endDate,
            ownerId: selectedOwner?.id,
            userIds: selectedUsers?.map(user => user.id) || [],
        };

        try {
            const validatedData: CreateProjectFormData = createProjectSchema.parse(formData);

            const payload = {
                ...validatedData,
                startDate: format(validatedData.startDate, "yyyy-MM-dd"),
                endDate: format(validatedData.endDate, "yyyy-MM-dd")
            };

            /* Save  */
            createProject(payload);

            // Clear errors if validation passes
            setErrors({});

            // Close the dialog and reset form
            onOpenChange(false);
            resetForm();
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle validation errors
                const formattedErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    const field = err.path.join('.');
                    formattedErrors[field] = err.message;
                    console.log(`${field}: ${err.message}`);
                });
                setErrors(formattedErrors);
            }
        }
    };

    const createProject = async (payload: any) => {
        try {
            const res = await API.post("create_project", { data: payload });
            if (res.data.success) {
                toast.success(res.data.message);
                await fetchProjects();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Server error occurred");
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await API.get('get_projects');

            if (response.data.success && Array.isArray(response.data.projects)) {
                dispatch(setAllProjects(response.data.projects));

            }
        } catch (error) {
            toast.error('Failed to fetch projects');
        }
    };

    /* Handle the Selected Project User (Select/Deselect) */
    const handleProjectUserToggle = (user: any) => {
        if (!selectedOwner) {
            toast.error("Please select owner first");
            return;
        }
        setSelectedUsers(prev => {
            const isSelected = prev.find(u => u.id === user.id);
            if (isSelected) {
                return prev.filter(u => u.id !== user.id);
            } else {
                return [...prev, user];
            }
        });
    };

    const resetForm = () => {
        setTitle('');
        setSummary('');
        setDescription('');
        setStartDate(undefined);
        setEndDate(undefined);
        setSelectedOwner(null);
        setSelectedUsers([]);
        setErrors({});
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    className="w-full sm:max-w-3xl max-h-[90vh] min-h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-center !text-[22px] !font-semibold">Create Project</DialogTitle>
                        <DialogDescription className="text-center text-gray-400 text-base font-semibold">Create and manage your projects efficiently</DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <div className='grid flex-1 gap-6 overflow-y-auto scroll-smooth'>
                        <div className='grid gap-2'>
                            <Label htmlFor='title'>Project Title <span className="text-red-500">*</span></Label>
                            <input
                                id="title"
                                type='text'
                                placeholder="Enter Project Title"
                                className="py-2 px-4 border rounded-md placeholder:text-sm"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoComplete="off"
                            />
                            {errors.title && (
                                <span className="text-red-500 text-sm">{errors.title}</span>
                            )}
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='summary'>Project Summary <span className="text-red-500">*</span></Label>
                            <input
                                id="summary"
                                placeholder="Enter Project Summary"
                                className="py-2 px-4 border rounded-md placeholder:text-sm"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                autoComplete="off"
                            />
                            {errors.summary && (
                                <span className="text-red-500 text-sm">{errors.summary}</span>
                            )}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                            <textarea
                                id="description"
                                placeholder="Describe the Project objectives, requirements, and expected outcomes..."
                                className="py-2 px-4 border rounded-md placeholder:text-sm"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                autoComplete="off"
                            />
                            {errors.description && (
                                <span className="text-red-500 text-sm">{errors.description}</span>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className='sm:w-1/2 space-y-2 w-full'>
                                <Label htmlFor="start_date">Start Date <span className="text-red-500">*</span></Label>
                                <Popover open={calendarOpenStart} onOpenChange={setCalendarOpenStart}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full h-12 justify-start text-left font-normal",
                                                !startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon />
                                            {startDate ? format(startDate, "dd/MM/yyyy") : <span>Start Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) => {
                                                setStartDate(date)
                                                setCalendarOpenStart(false)
                                            }}
                                            captionLayout="dropdown-buttons"
                                            fromYear={2025}
                                            toYear={2035}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.startDate && (
                                    <span className="text-red-500 text-sm">{errors.startDate}</span>
                                )}
                            </div>
                            <div className='sm:w-1/2 space-y-2 w-full'>
                                <Label htmlFor="end_date">End Date <span className="text-red-500">*</span></Label>
                                <Popover open={calendarOpenEnd} onOpenChange={setCalendarOpenEnd}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full h-12 justify-start text-left font-normal",
                                                !endDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon />
                                            {endDate ? format(endDate, "dd/MM/yyyy") : <span>End Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={(date) => {
                                                setEndDate(date)
                                                setCalendarOpenEnd(false)
                                            }}
                                            captionLayout="dropdown-buttons"
                                            fromYear={2025}
                                            toYear={2035}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.endDate && (
                                    <span className="text-red-500 text-sm">{errors.endDate}</span>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-col-12 gap-3">
                            <Label htmlFor="owner">Project Owner <span className="text-red-500">*</span></Label>
                            <Popover open={ownerPopoverOpen} onOpenChange={setOwnerPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 justify-between"
                                    >
                                        {selectedOwner ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6" key={selectedOwner?.id}>
                                                    {selectedOwner?.image && selectedOwner.image.trim() !== "" ? (
                                                        <AvatarImage src={selectedOwner.image} alt={selectedOwner.full_name} />
                                                    ) : (
                                                        <AvatarFallback className="text-xs font-medium bg-black text-white flex items-center justify-center">
                                                            {selectedOwner?.full_name.charAt(0)}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <span className="text-sm">{selectedOwner.full_name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 font-normal">Select Owner</span>
                                        )}
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
                                                    value={searchOwner}
                                                    onChange={(e) => setSearchOwner(e.target.value)}
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
                                            {filteredProjectOwner.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
                                                    onClick={() => {
                                                        setSelectedOwner(user);
                                                        setOwnerPopoverOpen(false);
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

                                            {filteredProjectOwner.length === 0 && (
                                                <div className="p-4 text-center text-gray-500 text-sm">
                                                    No users found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            {errors.ownerId && (
                                <span className="text-red-500 text-sm">{errors.ownerId}</span>
                            )}
                        </div>

                        {/* Project Assignee */}
                        <div className="grid grid-col-12 gap-3">
                            <Label htmlFor="users">Project Users</Label>
                            <Popover open={userAssigneePopoverOpen} onOpenChange={setUserAssigneePopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full min-h-12 justify-between"
                                        disabled={!selectedOwner}
                                    >
                                        <div className="flex items-center gap-2">
                                            {selectedUsers.length > 0 ? (
                                                <>
                                                    {selectedUsers.slice(0, visibleUser).map((user) => (
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
                                                    {selectedUsers.length > visibleUser && (
                                                        <span className="text-xs text-gray-500">+{selectedUsers.length - visibleUser} more</span>
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
                                                    value={searchUser}
                                                    onChange={(e) => setSearchUser(e.target.value)}
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

                                            {filteredUsers.map((user) => {
                                                const isSelected = selectedUsers.some(u => u.id === user.id);
                                                return (
                                                    <div
                                                        key={user.id}
                                                        className={`flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors ${isSelected ? 'bg-blue-50 border border-blue-200' : ''
                                                            }`}
                                                        onClick={() => handleProjectUserToggle(user)}
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
                                            {filteredUsers.length === 0 && (
                                                <div className="p-4 text-center text-gray-500 text-sm">
                                                    No user found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            {/* {selectedUsers.length > 0 && (
                                <div className="">
                                    <p className="text-gray-500 mb-2 text-sm">Selected : {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUsers.map((user) => (
                                            <span
                                                key={user.id}
                                                className="rounded-full text-xs px-2 py-1 bg-blue-100 text-blue-800 flex items-center gap-1">
                                                {user.full_name}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleProjectUserToggle(user);
                                                    }}
                                                    className="text-blue-500 hover:text-blue-800 cursor-pointer">
                                                    <X size={14} className="" />
                                                </button>
                                            </span>
                                        )
                                        )}
                                    </div>
                                </div>
                            )} */}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline"
                                onClick={resetForm}
                            >Cancel</Button>
                        </DialogClose>
                        <Button color="green"
                            onClick={handleCreate}
                        >Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    );
};
export default CreateProjectDialog;
