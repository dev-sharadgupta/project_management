import { Settings, User2Icon, LogOutIcon, MoveLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { useAppSelector } from '@/store/hooks'

const DashboardHead = () => {
    // const user = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces'
    // const user = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${Math.random().toString(36).substring(7)}`
    // const user = `https://robohash.org/${Math.random().toString(36).substring(2)}.png?size=80x80`
    const user = `https://ui-avatars.com/api/?name=Sharad+Gupta&size=80`

    const { selectedProject } = useAppSelector(state => state.project);


    return (
        <>
            <header>
                <div className='py-2 px-2 items-center'>
                    <div className='flex justify-between items-center px-5'>
                        {/* <Button
                            variant="ghost"
                            onClick={() => {
                                navigate('/');
                            }
                            }
                            className="items-center gap-2 text-sm text-gray-600 hover:text-blue-600 rounded-md w-fit bg-gray-100"
                        >
                            <MoveLeft className="w-5 h-5" />
                            <span className="">Back to Projects</span>
                        </Button> */}
                        <Breadcrumb>
                            <BreadcrumbList className=''>
                                <BreadcrumbItem >
                                    <BreadcrumbLink href="/"
                                        className="hover:text-blue-600 font-semibold">
                                        Projects
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{selectedProject?.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
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

        </>
    )
}

export default DashboardHead