import type { TargetType } from '@/types/target';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


interface targetState {
    selectedTargetView: 'grid' | 'list';
    callGetTargetApi: boolean;
    selectedTarget: TargetType | null;
    callGetTargetPriorityApi: boolean;
    callGetTargetStatusApi: boolean;
}

const initialState: targetState = {
    selectedTargetView: 'grid',
    callGetTargetApi: false,
    selectedTarget: null,
    callGetTargetPriorityApi: false,
    callGetTargetStatusApi: false,
};

const targetSlice = createSlice({
    name: 'target',
    initialState,
    reducers: {
        setTargetSelectedView(state, action: PayloadAction<'grid' | 'list'>) {
            state.selectedTargetView = action.payload;
        },
        setCallGetTargetApi(state, action: PayloadAction<boolean>) {
            state.callGetTargetApi = action.payload;
        },
        setSelectedTarget(state, action: PayloadAction<TargetType | null>) {
            state.selectedTarget = action.payload;
        },
        setCallGetTargetPriorityApi(state, action: PayloadAction<boolean>) {
            state.callGetTargetPriorityApi = action.payload;
        },
        setCallGetTargetStatusApi(state, action: PayloadAction<boolean>) {
            state.callGetTargetStatusApi = action.payload;
        },
    },
});

export const {
    setTargetSelectedView,
    setCallGetTargetApi,
    setSelectedTarget,
    setCallGetTargetPriorityApi,
    setCallGetTargetStatusApi,
} = targetSlice.actions;

export default targetSlice.reducer;
