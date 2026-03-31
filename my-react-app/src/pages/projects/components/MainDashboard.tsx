import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setProjectSelectedView, setAllProjects, setSelectedProject } from '@/store/slices/projectSlice'
import { Crown, Grid2X2Plus, List } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { projectStatusColorMap } from '@/lib/badgeColor';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import ProjectUserDialog from '../../dashboard/components/ProjectUserDialog';
import { useLocation, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import API from '@/lib/axios';
import { toast } from 'sonner';
import type { ProjectAssignee, ProjectType } from '@/types/project';
import { dateComparator } from '@/lib/dateHelper';
import { getRandomColor } from '@/lib/customHelper';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);


const MainDashboard = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.project);
    const [showProjectUserDialog, setShowProjectUserDialog] = useState(false);
    const [searchUser, setSearchUser] = useState('');
    const [projectUser, setProjectUser] = useState<ProjectAssignee[]>([]);
    const navigate = useNavigate();
    const visibleUser = 5;
    // const selectItemCustom = "text-xs h-7 py-1 data-[highlighted]:text-blue-500 hover:cursor-pointer";
    const selectedProjectView = useSelector(
        (state: RootState) => state.project?.selectedProjectView ?? 'grid'
    );
    const filteredProject = useSelector((state: RootState) => state.project.filteredProjects);


    /******* Start- Filter Project User - When Search *********/
    const filteredProjectUsers = projectUser.filter(user =>
        (user.full_name?.toLowerCase() || '').includes(searchUser.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchUser.toLowerCase())
    );
    /******* Start- Filter Project User - When Search *********/

    /************ Start- Raw data for Table View ***********/
    // Renderer for assignees
    const AssigneesRenderer = ({ value }: any) => {
        return (
            <div className="flex items-center -space-x-2">
                {value?.slice(0, 4).map((person: any) => (
                    <Tooltip key={person.id}>
                        <TooltipTrigger asChild>
                            <div className="relative z-0 hover:z-10 transition-all duration-200">
                                <Avatar className="w-6 h-6 shadow-lg transition-transform duration-200 cursor-pointer">
                                    {person.image ? (
                                        <AvatarImage src={person.image}
                                        />
                                    ) : (
                                        <AvatarFallback className={`text-xs font-semibold text-white ${person.bgColor || 'bg-gray-500'}`}>
                                            {person.full_name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            <p className="text-sm font-medium">{person.full_name}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
                {value.length > 4 && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="relative z-0 hover:z-10 transition-all duration-200 cursor-pointer"
                                onClick={() => {
                                    setProjectUser(value);
                                    setShowProjectUserDialog(true);
                                }}
                            >
                                <Avatar className="w-6 h-6 shadow-lg text-white">
                                    <AvatarFallback className="text-xs font-semibold bg-black text-white">
                                        +{value.length - 4}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            <p className="text-sm font-medium">View more User</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
        );
    };
    // Column Definitions: Defines the columns to be displayed.
    const columnDefs: ColDef<ProjectType>[] = [

        { field: 'title', headerName: 'Project Name' },
        { field: 'description', headerName: 'Description' },
        {
            field: 'start_date',
            headerName: 'Start Date',
            sortable: true,
            comparator: dateComparator
        },
        {
            field: 'end_date',
            headerName: 'End Date',
            sortable: true,
            comparator: dateComparator
        },
        {
            field: 'assignees',
            headerName: 'Members',
            sortable: false,
            cellRenderer: AssigneesRenderer,
            cellStyle: { display: 'flex', alignItems: 'center' },
            valueFormatter: (params: any) => { // Prevents the AG Grid error.
                return params.value?.map((p: any) => p.name).join(', ') || '';
            },
        },
        {
            field: 'project_status',
            headerName: 'Status',
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: (params: any) => {
                return (
                    <Badge className={projectStatusColorMap[params.data.project_status]} size="xs" fontSize="xs">{params.data.status_name}</Badge>
                );
            },
        },
        {
            headerName: 'Action',
            sortable: false,
            cellRenderer: (params: any) => {
                return (
                    <Button color='gray' fontSize="xs" size="sm" onClick={() => { handleSelectProject(params.data) }}>View</Button>
                );
            },
        },
    ];

    const defaultColDef = useMemo(() => {
        return {
            width: 150,
            flex: 1,
            cellStyle: { fontWeight: 'semibold' },
        };
    }, []);
    /************ Start- Raw data for Table View ***********/


    /************ Start- Fetch Projects ***********/
    useEffect(() => {
        if (location.pathname === '/' && !loading) {
            fetchProjects();
        }
    }, [location.pathname, dispatch]);


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
    /************ End - Fetch Projects ***********/


    /************ Start - Handle the Select Project ***********/
    const handleSelectProject = (project: any) => {
        dispatch(setSelectedProject(project)); /* Set the selected project in Redux */
        navigate('/dashboard'); /* Navigate to project dashboard */
    }
    /************ End - Handle the Select Project ***********/

    return (
        <div>
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

            <div className="flex space-y-2.5 sm:space-y-0 p-6 justify-between">
                {/* Header */}
                <div className='flex items-center gap-2'>
                    <h5 className='text-gray-700'>Projects</h5>
                    {/* <div className='flex items-center text-gray-400 font-semibold'>
                        <p className='text-sm'>by Recent Updates</p>
                        <ArrowDown className='w-4 h-3' />
                    </div> */}
                </div>

                <div className='flex gap-2 items-center hover:cursor-pointer'>
                    {/* Grid View */}
                    <Tooltip>
                        <TooltipTrigger>
                            <div
                                onClick={() => dispatch(setProjectSelectedView('grid'))}
                                className={`w-8 h-8 rounded-sm p-1 cursor-pointer ${selectedProjectView === 'grid' ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-400'
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
                                onClick={() => dispatch(setProjectSelectedView('list'))}
                                className={`w-8 h-8 rounded-sm p-1 cursor-pointer ${selectedProjectView === 'list' ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-400'
                                    }`}
                            >
                                <List />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            List View
                        </TooltipContent>
                    </Tooltip>

                    {/* Select Box  */}
                    {/* <Select>
                        <SelectTrigger className="w-[150px] text-xs py-1 hover:cursor-pointer">
                            <SelectValue placeholder="Select Period" />
                        </SelectTrigger>
                        <SelectContent className="text-xs py-1">
                            <SelectGroup>
                                <SelectLabel>Select</SelectLabel>
                                <SelectItem className={selectItemCustom} value="recently_updated">Recently Updated</SelectItem>
                                <SelectItem className={selectItemCustom} value="last_month">Last Month</SelectItem>
                                <SelectItem className={selectItemCustom} value="last_quarter">Last Quarter</SelectItem>
                                <SelectItem className={selectItemCustom} value="last_year">Last Year</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select> */}
                </div>
            </div>

            {/* Kanban Board Grid layout*/}
            {selectedProjectView === 'grid' && (
                <div className='px-5 py-1'>
                    {Array.isArray(filteredProject) && filteredProject.length > 0 ? (
                        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
                            {filteredProject.map((project) => (
                                <Card
                                    key={project.project_id}
                                    className='px-0 cursor-pointer hover:border-blue-400'
                                    onClick={() => handleSelectProject(project)}
                                >
                                    <CardHeader className=''>
                                        <div className='flex justify-between items-center'>
                                            <img className="rounded-md size-13" src='/profile-img.png' alt="Logo" />
                                            <Badge
                                                className={`${projectStatusColorMap[project?.project_status ?? 0]}`}
                                                size="lg"
                                                fontSize="sm"
                                            >
                                                {project?.status_name}
                                            </Badge>
                                        </div>
                                        <div className='flex justify-between items-center mt-4'>
                                            <div className='flex'><h5>{project.title}</h5></div>
                                            {/* <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gradient-to-r from-yellow-100 to-purple-100 text-yellow-900 font-medium  gap-1">
                                                <Crown className="w-3 h-3 text-yellow-600" />
                                                <span>{project?.owner_name} (Owner)</span>
                                            </div> */}
                                        </div>

                                    </CardHeader>
                                    <CardContent className='-mt-4'>
                                        <p className='text-gray-400 font-medium text-sm'>{project.description}</p>
                                        <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs bg-gradient-to-r from-yellow-100 to-purple-100 text-yellow-900 font-medium  gap-1">
                                            <Crown className="w-3 h-3 text-yellow-600" />
                                            <span>{project?.owner_name} (Owner)</span>
                                        </div>
                                        <div className="mt-4 flex flex-wrap justify-center md:justify-between gap-y-2 gap-2">
                                            <div className="w-full sm:w-auto border-1 border-dashed rounded-sm py-2 px-4 text-center sm:text-left text-sm">
                                                <p className="font-medium">{project?.start_date}</p>
                                                <p className="text-gray-400 font-semibold">Start Date</p>
                                            </div>
                                            <div className="w-full sm:w-auto border-1 border-dashed rounded-sm py-2 px-4 text-center sm:text-left  text-sm">
                                                <p className="font-medium">{project?.end_date}</p>
                                                <p className="text-gray-400 font-semibold">End Date</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className='justify-between flex-wrap -mt-2'>
                                        <div className='flex -space-x-3'>
                                            <TooltipProvider>
                                                {project.assignees.slice(0, visibleUser).map((assignee, index) => {
                                                    const fallbackColor = getRandomColor();
                                                    return (
                                                        <Tooltip key={index}>
                                                            <TooltipTrigger asChild>
                                                                <div className="relative z-0 hover:z-10 transition-all duration-200"
                                                                    onClick={(e) => e.stopPropagation()}>
                                                                    <Avatar className="w-9 h-9 shadow-lg transition-transform duration-200 cursor-pointer">
                                                                        {assignee.image ? (
                                                                            <AvatarImage src={assignee.image} />
                                                                        ) : (
                                                                            <AvatarFallback className={`text-xs font-semibold text-white ${fallbackColor}`}>
                                                                                {assignee.full_name.charAt(0).toUpperCase()}
                                                                            </AvatarFallback>
                                                                        )}
                                                                    </Avatar>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top">
                                                                <p className="text-sm font-medium">{assignee.full_name}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    );
                                                })}
                                                {project.assignees.length > visibleUser && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                className="relative z-0 hover:z-10 transition-all duration-200 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setProjectUser(project.assignees);
                                                                    setShowProjectUserDialog(true);
                                                                }}
                                                            >
                                                                <Avatar className="w-9 h-9 shadow-lg text-white">
                                                                    <AvatarFallback className="text-xs font-semibold bg-black text-white">
                                                                        +{project.assignees.length - visibleUser}
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
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-16 text-lg font-medium">No project found</div>
                    )}
                </div>
            )}

            {selectedProjectView === 'list' && (
                <div className='mx-6 p-6 border-2 rounded-md'>
                    <AgGridReact
                        domLayout="autoHeight"
                        rowData={filteredProject}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                    />

                </div>
            )}

        </div>
    )
}

export default MainDashboard
