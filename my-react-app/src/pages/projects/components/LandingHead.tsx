import { Settings, SearchIcon, FilterIcon, User2Icon, LogOutIcon, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDispatch } from 'react-redux'
import { setProjectSearchQuery, setProjectStatusFilter } from '@/store/slices/projectSlice'
import { useEffect, useState } from 'react'
import CreateProjectDialog from './CreateProjectDialog'
import API from '@/lib/axios'
import { toast } from 'sonner'
import type { User } from '@/types/user'
const HeadComponent = () => {
    const dispatch = useDispatch();
    const [createProjectDialog, setCreateProjectDialog] = useState(false);
    const selectItemCustom = "text-xs h-7 py-1 data-[highlighted]:text-blue-500 hover:cursor-pointer";
    // const user = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces'
    // const user = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${Math.random().toString(36).substring(7)}`
    // const user = `https://robohash.org/${Math.random().toString(36).substring(2)}.png?size=80x80`
    const user = `https://ui-avatars.com/api/?name=Sharad+Gupta&size=80`

    const [projectUser, setProjectUser] = useState<User[]>([]);
    const [searchOwner, setSearchOwner] = useState('');

    /* Filter Project Owner - When Search */
    const filteredProjectOwner = projectUser.filter(user =>
        (user.full_name?.toLowerCase() || '').includes(searchOwner.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchOwner.toLowerCase())
    );

    const handleProjectSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setProjectSearchQuery(e.target.value));
    }

    /* Fetch the User */
    const getAllUsers = async () => {
        try {
            const response = await API.get('get_allUsers');
            if (response.data.success && Array.isArray(response.data.users)) {
                setProjectUser(response.data.users);
            }
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    /* Fetch the all User When Create Preoject Dialog box open */
    useEffect(() => {
        if (createProjectDialog) {
            getAllUsers();
        }
    }, [createProjectDialog]);


    const statusOptions = [
        { label: "Select All", value: "all" },
        { label: "Yet to start", value: "1" },
        { label: "In Progress", value: "2" },
        { label: "Complete", value: "3" },
        { label: "Rejected", value: "4" },
    ];

    return (
        <>
            <header>
                {/* Search */}
                <div className='flex py-3 px-3 border border-gray-100 justify-end space-x-4 items-center'>
                    <div className='hidden lg:flex items-center relative'>
                        <div className='absolute pl-3'>
                            <SearchIcon className='size-5 text-gray-400' />
                        </div>
                        <input
                            id='search_project'
                            type='text'
                            placeholder='Search Project...'
                            className='border rounded-md py-[9px] px-2 pl-10 placeholder-gray-400 focus:outline-none text-xs'
                            onChange={handleProjectSearch}
                        />
                    </div>
                    <div className='lg:hidden border p-2 rounded-md'>
                        <SearchIcon className='size-5 text-gray-400' />
                    </div>
                    <div>
                        <Select
                            defaultValue="all"
                            onValueChange={(value) => {
                                const parsedValue = value === "all" ? null : parseInt(value);
                                dispatch(setProjectStatusFilter(parsedValue));
                            }}>
                            <SelectTrigger className="w-auto text-xs py-1 hover:cursor-pointer">
                                <FilterIcon />
                                <span className='hidden lg:flex'>
                                    <SelectValue placeholder="Select Status" />
                                </span>
                            </SelectTrigger>
                            <SelectContent className="text-lg py-1">
                                <SelectGroup>
                                    <SelectLabel>Select</SelectLabel>
                                    {statusOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            className={selectItemCustom}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Button color='blue' fontSize="xs" onClick={() => setCreateProjectDialog(true)}> <FileText />Create New Project</Button>
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="w-10 h-10 ring-2 ring-blue-400 hover:cursor-pointer">
                                    {user ? (
                                        <AvatarImage src={user} />
                                        // <div className="flex items-center justify-center w-full h-full">
                                        //     <User2Icon className="size-4" />
                                        // </div>
                                    ) : (
                                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold flex items-center justify-center">
                                            <div className="flex items-center justify-center w-full h-full">
                                                <User2Icon className="size-4" />
                                            </div>
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-50 md:w-64" align="start" >
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <User2Icon /> Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings /> Settings
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogOutIcon />Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Dialog for Show Create project */}
            <CreateProjectDialog
                open={createProjectDialog}
                onOpenChange={(open) => {
                    setCreateProjectDialog(open);
                }}
                filteredProjectOwner={filteredProjectOwner}

                searchOwner={searchOwner}
                setSearchOwner={setSearchOwner}
            />
        </>
    )
}

export default HeadComponent