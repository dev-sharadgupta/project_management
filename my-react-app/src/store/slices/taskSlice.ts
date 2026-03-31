import type { TaskType } from '@/types/task';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


interface taskState {
    selectedTaskView: 'grid' | 'list';
    callGetTaskApi: boolean;
    selectedTask: TaskType | null;
    callGetTaskPriorityApi: boolean;
    callGetTaskStatusApi: boolean;
}

const initialState: taskState = {
    selectedTaskView: 'grid',
    callGetTaskApi: false,
    selectedTask: null,
    callGetTaskPriorityApi: false,
    callGetTaskStatusApi: false,
};

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTaskSelectedView(state, action: PayloadAction<'grid' | 'list'>) {
            state.selectedTaskView = action.payload;
        },
        setCallGetTaskApi(state, action: PayloadAction<boolean>) {
            state.callGetTaskApi = action.payload;
        },
        setSelectedTask(state, action: PayloadAction<TaskType | null>) {
            state.selectedTask = action.payload;
        },
        setCallGetTaskPriorityApi(state, action: PayloadAction<boolean>) {
            state.callGetTaskPriorityApi = action.payload;
        },
        setCallGetTaskStatusApi(state, action: PayloadAction<boolean>) {
            state.callGetTaskStatusApi = action.payload;
        },
    },
});

export const {
    setTaskSelectedView,
    setCallGetTaskApi,
    setSelectedTask,
    setCallGetTaskPriorityApi,
    setCallGetTaskStatusApi,
} = taskSlice.actions;

export default taskSlice.reducer;
