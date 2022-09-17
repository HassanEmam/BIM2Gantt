import { createSlice } from "@reduxjs/toolkit";
const jobSlice = createSlice({
	name: "job",
	initialState: {
		job: 0,
	},
	reducers: {
		setJob: (state, action) => {
			state.job = action.payload;
		},
	},
});
export const { setJob } = jobSlice.actions;
export default jobSlice.reducer;
