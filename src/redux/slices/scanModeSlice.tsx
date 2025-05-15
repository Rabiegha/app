import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isKioskMode: true,
};
const scanSlice = createSlice({
  name: 'scan',
  initialState,
  reducers: {
    setKioskMode: (state, action) => {
      state.isKioskMode = action.payload;
    },
  },
});

export const {
    setKioskMode,
} = scanSlice.actions;
export default scanSlice.reducer;
