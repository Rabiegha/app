import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    isSearchByCompanyMode: true,
};
const searchSlice = createSlice({
  name: 'searchMode',
  initialState,
  reducers: {
    setSearchByCompanyMode: (state, action) => {
      state.isSearchByCompanyMode = action.payload;
    },
  },
});

export const {
    setSearchByCompanyMode,
} = searchSlice.actions;
export default searchSlice.reducer;
