import React, { useState, useRef, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addFilter, setExpressID, setFilter } from "../../../redux/loadSlice";
import { setStorageFilter, storageFilter } from "../../../redux/storageSlice";
import FilterBuildingStorey from "./FilterBuildingStorey";
import FilterCategories from "./FilterCategories";
import FilterTypes from "./FilterTypes";
import FilterList from "./FilterList";
import FilterResult from "./FilterResult";

const FilterTab = (props) => {
	const { showTab } = props;
	const url = useSelector((state) => state.loadIFC.ifcModelData?.url);
	const nameRef = useRef(null);
	const dispatch = useDispatch();
	const categories = useSelector((state) => state.loadIFC.ifcModelData?.categories);
	const structure = useSelector((state) => state.loadIFC.ifcModelData?.structure);
	// const originIfcModelIds = useSelector((state) => state.loadIFC.originIfcModelIds);
	const filterStorage = useSelector(
		(state) => state.storageIfcModelData.allModelData.find((d) => d.url === url)?.filters
	);
	const [filterLists, setFilterLists] = useState(useSelector((state) => state.loadIFC.ifcModelData?.filters));

	const [listCategories, setListCategories] = useState(
		categories
			? Object.keys(categories).map((key) => {
					return { name: categories[key].categoryName, id: categories[key].categoryID, checked: false };
			  })
			: null
	);
	const [listTypes, setListTypes] = useState(null);
	const [listBuildingStorey, setListBuildingStorey] = useState(
		structure
			? structure.map((s) => {
					return { name: s.Name.value, id: s.expressID, checked: false };
			  })
			: null
	);
	const [resultIds, setResultIds] = useState(filterLists ? [...filterLists[0].resultIds] : null);
	const [filterName, setFilterName] = useState(filterLists ? filterLists[0].name : "");

	const handleCheckCategories = (e) => {
		var id = parseInt(e.target.getAttribute("id"));
		if (listCategories) {
			var newListCategories = listCategories.map((l) => {
				return {
					name: l.name,
					id: l.id,
					checked: l.id === id ? e.target.checked : l.checked,
				};
			});
			setListCategories(newListCategories);
			setListTypes(getTypeFromCategory(newListCategories));
		}
	};
	const getTypeFromCategory = (newListCategories) => {
		let types = [];
		newListCategories.forEach((c) => {
			if (c.checked) {
				Object.keys(categories).forEach((key) => {
					if (parseInt(c.id) === categories[key].categoryID) {
						const typeKeys = Object.keys(categories[key].typeID);
						typeKeys.forEach((type) => {
							types.push({ name: type, id: categories[key].typeID[type], checked: true });
						});
					}
				});
			}
		});
		return types;
	};

	const handleCheckFilterTypes = (e) => {
		var id = parseInt(e.target.getAttribute("id"));
		if (listTypes) {
			var newListTypes = listTypes.map((l) => {
				return {
					name: l.name,
					id: l.id,
					checked: l.id === id ? e.target.checked : l.checked,
				};
			});
			setListTypes(newListTypes);
			dispatch(setExpressID(getIdsByTypes(newListTypes)));
		}
	};
	const getIdsByTypes = (newListTypes) => {
		let ids = [];
		if (categories) {
			Object.keys(categories).forEach((key) => {
				const typeKeys = Object.keys(categories[key].type);
				typeKeys.forEach((type) => {
					newListTypes.forEach((n) => {
						if (n.name === type && n.checked) {
							ids = ids.concat(categories[key].type[type]);
						}
					});
				});
			});
		}
		return ids;
	};
	const handleCheckFilterBuildingStorey = (e) => {
		var id = parseInt(e.target.getAttribute("id"));
		if (listBuildingStorey) {
			var newBuildingStorey = listBuildingStorey.map((l) => {
				return {
					name: l.name,
					id: l.id,
					checked: l.id === id ? e.target.checked : l.checked,
				};
			});
			setListBuildingStorey(newBuildingStorey);
		}
	};

	const handleApply = () => {
		setResultIds(getFilterExpressID());
		dispatch(setExpressID(getFilterExpressID()));
	};
	const getFilterExpressID = () => {
		let ids = [];
		Object.keys(categories).forEach((key) => {
			const typeKeys = Object.keys(categories[key].type);
			typeKeys.forEach((type) => {
				listTypes.forEach((list) => {
					if (list.name === type && list.checked) {
						ids = ids.concat(categories[key].type[type]);
					}
				});
			});
		});
		let ids1 = [];
		listBuildingStorey.forEach((b) => {
			structure.forEach((s) => {
				if (b.id === s.expressID && b.checked) {
					ids1 = ids1.concat(s.children.map((child) => child.expressID));
				}
			});
		});
		if (ids1.length === 0) {
			return ids;
		}
		let ids2 = [];
		ids.forEach((id) => {
			ids1.forEach((id1) => {
				if (id === id1) ids2.push(id1);
			});
		});
		ids2 = ids2.filter((item, pos) => ids2.indexOf(item) === pos);
		return ids2;
	};

	const handleAddFilter = () => {
		if (nameRef.current.value === "") {
			alert("Name is empty");
			return;
		}
		var exist = filterStorage ? filterStorage.find((f) => f.name === nameRef.current.value) : null;
		if (exist) {
			alert("Name is existed");
			return;
		}

		const filter = {
			name: nameRef.current.value,
			listCategories: listCategories,
			listTypes: listTypes,
			listBuildingStorey: listBuildingStorey,
			resultIds: resultIds,
		};
		if (filterLists) {
			setFilterLists([...filterLists, filter]);
		} else {
			setFilterLists([filter]);
		}
		dispatch(addFilter(filter));
		dispatch(storageFilter({ url: url, filter: filter }));
	};
	const handleFilterChoose = (e) => {
		var filterItem = filterLists.find((f) => f.name === e.target.getAttribute("name"));
		if (filterItem) {
			if (e.target.getAttribute("name") !== nameRef.current.value) {
				setFilterName(e.target.getAttribute("name"));
			}
			setResultIds([...filterItem.resultIds]);
			dispatch(setExpressID([...filterItem.resultIds]));
		}
	};
	const handleFilterDelete = (e) => {
		var filterItem = filterLists.find((f) => f.name === e.target.getAttribute("name"));
		if (filterItem) {
			var newFilterLists = [...filterLists];
			newFilterLists = newFilterLists.slice(newFilterLists.indexOf(filterItem), 1);
			setFilterLists([...newFilterLists]);
			dispatch(setFilter(newFilterLists));
			dispatch(setStorageFilter({ url: url, filterLists: newFilterLists }));
		}
	};

	const [pullIds, setPullIds] = useState([]);

	const handleCheckFilterResult = (e) => {
		var id = parseInt(e.target.getAttribute("id"));
		var express = parseInt(e.target.getAttribute("express"));
		var newIds = [...pullIds];
		if (express % 2 === 0) {
			e.target.classList.add("expressIDFilter-active");
			newIds.push(id);
		} else {
			e.target.classList.remove("expressIDFilter-active");
			newIds = newIds.slice(newIds.indexOf(id), 1);
		}
		express++;
		e.target.setAttribute("express", express);
		setPullIds(newIds);
		dispatch(setExpressID(newIds));
	};
	//#region load
	useEffect(() => {
		if (showTab && listCategories) {
			var newIfcModelIds = [];
			listCategories.forEach((c) => {
				if (c.checked) {
					const ids = categories[c.name]?.ids;
					if (ids) {
						newIfcModelIds = newIfcModelIds.concat(ids);
					}
				}
			});
			dispatch(setExpressID(newIfcModelIds));
		}
	}, [showTab, listCategories]);
	//#endregion
	return (
		<div className="container-fluid" style={{ marginTop: "5px", width: "800px" }}>
			<div className="row">
				<div className="d-flex justify-content-start">
					<div style={{ margin: "0 20px", lineHeight: "30px" }}>Name</div>
					<input
						type="text"
						className="form-control"
						placeholder="Filter Name"
						style={{ width: "60%", paddingLeft: "5px" }}
						ref={nameRef}
						value={filterName}
						onChange={(e) => setFilterName(e.target.value)}
					/>
					<button className="btn btn-success" onClick={handleApply}>
						Apply
					</button>

					<button
						className="btn btn-primary"
						onClick={handleAddFilter}
						disabled={!resultIds || resultIds.length === 0}
					>
						Add Filter
					</button>
				</div>
			</div>
			<br />
			<div className="row">
				<div className="col-lg-9 col-sm-9">
					<table className="table table-bordered">
						<tbody className="filter">
							<tr>
								<th>Category</th>
								<th>Type</th>
								<th>Building Storey</th>
								{/* <th>All ExpressID</th>
								<th rowSpan={2} style={{ padding: "2px" }}>
									<div className="listFilterItem">
										<div className="filterSwitch">
											<button className="btn btn-primary" onClick={handlePullIds}>
												{"<<"}
											</button>

											<button className="btn btn-primary" onClick={handlePushIds}>
												{">>"}
											</button>
										</div>
									</div>
								</th> */}
								<th>ExpressID</th>
							</tr>
							<tr>
								<td>
									<div className="listFilterItem">
										{
											<FilterCategories
												listCategories={listCategories}
												handleCheckCategories={handleCheckCategories}
											/>
										}
									</div>
								</td>
								<td>
									<div className="listFilterItem">
										{
											<FilterTypes
												listTypes={listTypes}
												handleCheckFilterTypes={handleCheckFilterTypes}
											/>
										}
									</div>
								</td>
								<td>
									<div className="listFilterItem">
										{
											<FilterBuildingStorey
												listBuildingStorey={listBuildingStorey}
												handleCheckFilterBuildingStorey={handleCheckFilterBuildingStorey}
											/>
										}
									</div>
								</td>
								{/* <td>
									<div className="listFilterItem">
										{
											<FilterExpressID
												originIfcModelIds={originIfcModelIds}
												handleCheckFilterExpressID={handleCheckFilterExpressID}
											/>
										}
									</div>
								</td> */}
								<td>
									<div className="listFilterItem">
										{
											<FilterResult
												resultIds={resultIds}
												handleCheckFilterResult={handleCheckFilterResult}
											/>
										}
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="col-lg-3 col-sm-3">
					<FilterList
						filterLists={filterLists}
						handleFilterChoose={handleFilterChoose}
						handleFilterDelete={handleFilterDelete}
					></FilterList>
				</div>
			</div>
		</div>
	);
};

export default FilterTab;
