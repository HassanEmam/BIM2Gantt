import { createSlice } from "@reduxjs/toolkit";
const extensionSlice = createSlice({
	name: "extension",
	initialState: {
		chart: {
			field: null,
			type: null,
			isDraw: false,
		},
		buildingLevel: null,
	},
	reducers: {
		defaultChart: (state, action) => {
			const { field, type } = action.payload;
			state.chart.field = field;
			state.chart.type = type;
			state.chart.isDraw = false;
		},
		generateChart: (state, action) => {
			const { field, type } = action.payload;
			state.chart.field = field;
			state.chart.type = type;
			state.chart.isDraw = true;
		},
		setBuildingLevel: (state, action) => {
			state.buildingLevel = action.payload;
		},
	},
});
export const { defaultChart, generateChart, setBuildingLevel } = extensionSlice.actions;
export default extensionSlice.reducer;
