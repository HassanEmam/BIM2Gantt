import { createSlice } from "@reduxjs/toolkit";
const loadSlice = createSlice({
	name: "loadIFC",
	initialState: {
		loading: false,
		ifcInfo: null,
		ifcModelData: null,
		originIfcModelIds: null,
		highlightIfcModelIds: [],
		expressID: null,
		filterExpressID: null,
	},
	reducers: {
		loadStart: (state) => {
			state.loading = true;
		},
		loadSuccess: (state, action) => {
			state.loading = false;
			state.ifcInfo = action.payload;
		},

		getIfcModelData: (state, action) => {
			state.ifcModelData = action.payload;
			state.originIfcModelIds = action.payload.ifcModelIds;
		},
		setIfcModelIds: (state, action) => {
			state.ifcModelData.ifcModelIds = action.payload;
		},
		hoverIfcModelIds: (state, action) => {
			state.highlightIfcModelIds = action.payload;
		},
		setPropertySets: (state, action) => {
			const { ifcType, propertySets } = action.payload;
			if (state.ifcModelData.categories[ifcType]) {
				state.ifcModelData.categories[ifcType].props.push(propertySets);
			}
		},
		addFilter: (state, action) => {
			if (!state.ifcModelData.filter) state.ifcModelData.filters = [];
			state.ifcModelData.filters.push(action.payload);
		},
		setFilter: (state, action) => {
			state.ifcModelData.filters = action.payload;
		},
		setExpressID: (state, action) => {
			state.expressID = action.payload;
		},
		setFilterExpressID: (state, action) => {
			state.filterExpressID = action.payload;
		},
	},
});
export const {
	loadStart,
	loadSuccess,
	getIfcModelData,
	setIfcModelIds,
	hoverIfcModelIds,
	setPropertySets,
	addFilter,
	setFilter,
	setExpressID,
	setFilterExpressID,
} = loadSlice.actions;
export default loadSlice.reducer;
