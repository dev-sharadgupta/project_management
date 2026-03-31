import type { ProjectType } from '@/types/project';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
    selectedProjectView: 'grid' | 'list';
    projects: ProjectType[];
    selectedProject: ProjectType | null;
    showAddTarget: boolean;
    showAddTask: boolean;
    showAddNote: boolean;
    loading: boolean;
    error: string | null;
    projectSearchQuery: string;
    filteredProjects: ProjectType[];
    projectStatusFilter: string;
}

const initialState: ProjectState = {
    selectedProjectView: 'grid',
    projects: [],
    selectedProject: null,
    showAddTarget: false,
    showAddTask: false,
    showAddNote: false,
    loading: false,
    error: null,
    projectSearchQuery: '',
    filteredProjects: [],
    projectStatusFilter: '',
};

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setProjectSelectedView(state, action: PayloadAction<'grid' | 'list'>) {
            state.selectedProjectView = action.payload;
        },
        setAllProjects(state, action: PayloadAction<ProjectType[]>) {
            state.projects = action.payload;
            state.filteredProjects = action.payload;
        },
        setSelectedProject(state, action: PayloadAction<ProjectType | null>) {
            state.selectedProject = action.payload;
        },

        setProjectSearchQuery(state, action: PayloadAction<string>) {
            state.projectSearchQuery = action.payload;
            state.filteredProjects = state.projects.filter(project =>
                project.title.toLowerCase().includes(action.payload.toLowerCase())
            );
        },
        setProjectStatusFilter(state, action: PayloadAction<number | null>) {
            if (action.payload === null) {
                state.filteredProjects = state.projects;
            } else {
                state.filteredProjects = state.projects.filter(
                    project => project.project_status === action.payload
                );
            }
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setShowAddTarget(state, action: PayloadAction<boolean>) {
            state.showAddTarget = action.payload;
        },
        setShowAddTask(state, action: PayloadAction<boolean>) {
            state.showAddTask = action.payload;
        },
        setShowAddNote(state, action: PayloadAction<boolean>) {
            state.showAddNote = action.payload;
        },
    },
});

export const {
    setProjectSelectedView,
    setAllProjects,
    setSelectedProject,
    setShowAddTarget,
    setShowAddTask,
    setShowAddNote,
    setProjectSearchQuery,
    setProjectStatusFilter,
    setLoading,
    setError,
} = projectSlice.actions;

export default projectSlice.reducer;
