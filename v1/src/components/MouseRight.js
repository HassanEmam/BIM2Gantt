import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterExpressID } from "../redux/loadSlice";

const MouseRight = (props) => {
	const { showMR, visibilityMR, handleIsolated, handleProperty, handleSelectAll, handleSelectFilter, handleShowAll } =
		props;
	const dispatch = useDispatch();
	const filterLists = useSelector((state) => state.loadIFC.ifcModelData?.filters);
	const styleMouseRight = () => {
		return {
			display: showMR ? "block" : "none",
			top: visibilityMR.top + "px",
			left: visibilityMR.left + "px",
		};
	};

	const styleElement = (show) => {
		return {
			display: show ? "block" : "none",
		};
	};
	const [showFilter, setShowFilter] = useState(false);
	const handleMouseEnter = () => {
		setShowFilter(showMR && true);
	};
	const handleMouseLeave = () => {
		setShowFilter(false);
	};
	const handleFilter = (e) => {
		var ids = e.target.getAttribute("ids");
		ids = ids.split(",");
		ids = ids.map((id) => parseInt(id));
		dispatch(setFilterExpressID(ids));
	};

	const getFilterList = () => {
		if (filterLists) {
			return (
				<>
					{filterLists.map((filter) => {
						return (
							<div className="btn" key={filter.name} ids={filter.resultIds} onClick={handleFilter}>
								{filter.name}
							</div>
						);
					})}
				</>
			);
		} else {
			return <></>;
		}
	};
	const [list, setList] = useState(getFilterList());
	useEffect(() => {
		setList(getFilterList());
	}, filterLists);
	return (
		<div className="card mouseRight" style={styleMouseRight()} onMouseLeave={handleMouseLeave}>
			<div className="card-body">
				<button className="btn" style={styleElement(visibilityMR.isolated)} onClick={handleIsolated}>
					Isolated
				</button>
				<button className="btn" style={styleElement(visibilityMR.property)} onClick={handleProperty}>
					Property
				</button>
				<button className="btn" style={styleElement(visibilityMR.selectAll)} onClick={handleSelectAll}>
					Select All
				</button>
				<button className="btn" style={styleElement(visibilityMR.selectFilter)} onClick={handleSelectFilter}>
					<div className="d-flex justify-content-between">
						<div style={{ lineHeight: "20px" }}>Select Filter</div>
						<div style={{ lineHeight: "20px" }} onMouseEnter={handleMouseEnter}>
							{">>"}
						</div>
					</div>
					<div className="card mouseRight-filter" style={styleElement(showFilter)}>
						<div className="card-body">{list}</div>
					</div>
				</button>
				<button className="btn" style={styleElement(visibilityMR.showAll)} onClick={handleShowAll}>
					Show All
				</button>
			</div>
		</div>
	);
};

export default MouseRight;
