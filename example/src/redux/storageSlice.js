import { createSlice } from "@reduxjs/toolkit";
const storageSlice = createSlice({
	name: "storageIfcModelData",
	initialState: {
		allModelData: [],
	},
	reducers: {
		storageIfcModelData: (state, action) => {
			state.allModelData.push(action.payload);
		},
		changePropertySets: (state, action) => {
			const { url, ifcType, propertySets } = action.payload;
			const item = state.allModelData.find((data) => data.url === url);
			if (item) {
				if (item.categories[ifcType]) {
					item.categories[ifcType].props.push(propertySets);
				}
			}
		},
		storageFilter: (state, action) => {
			const { url, filter } = action.payload;
			const item = state.allModelData.find((data) => data.url === url);
			if (item) {
				if (!item.filters) item.filters = [];
				item.filters.push(filter);
			}
		},
		setStorageFilter: (state, action) => {
			const { url, filterLists } = action.payload;
			var item = state.allModelData.find((data) => data.url === url);
			if (item) {
				item.filters = filterLists;
			}
		},
	},
});
export const { storageIfcModelData, changePropertySets, storageFilter, setStorageFilter } = storageSlice.actions;
export default storageSlice.reducer;
