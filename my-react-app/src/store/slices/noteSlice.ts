import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface noteState {
    callGetNoteApi: boolean;
}

const initialState: noteState = {
    callGetNoteApi: false,
};

const noteSlice = createSlice({
    name: 'note',
    initialState,
    reducers: {
        setCallGetNoteApi(state, action: PayloadAction<boolean>) {
            state.callGetNoteApi = action.payload;
        },
    },
});

export const {
    setCallGetNoteApi,
} = noteSlice.actions;

export default noteSlice.reducer;
