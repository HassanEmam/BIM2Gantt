import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { hoverIfcModelIds, setIfcModelIds } from "../../../redux/loadSlice";

const ModelType = (props) => {
	const { typeName, ids, hideCategory } = props;
	const dispatch = useDispatch();
	const ifcModelIds = useSelector((state) => state.loadIFC.ifcModelData?.ifcModelIds);
	const [hideType, setHideType] = useState(false);
	const handleHideType = () => {
		setHideType(!hideType);
		if (ids.length > 0) {
			var newIfcModelIds = ifcModelIds;
			if (hideType) {
				newIfcModelIds = newIfcModelIds.concat(ids);
			} else {
				newIfcModelIds = newIfcModelIds.filter((e) => {
					return ids.indexOf(e) < 0;
				});
			}
			dispatch(setIfcModelIds(newIfcModelIds));
		}
	};
	useEffect(() => {
		setHideType(hideCategory);
	}, [hideCategory]);
	const handleMouseEnter = () => {
		dispatch(hoverIfcModelIds(ids));
	};
	const handleMouseLeave = () => {
		dispatch(hoverIfcModelIds([]));
	};
	return (
		<div className="d-flex justify-content-between" style={{ marginLeft: "10px" }}>
			<button
				className="btn objectItem"
				disabled={hideCategory}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{typeName}
			</button>
			<button className="btn eyes" onClick={handleHideType} disabled={hideCategory}>
				<FontAwesomeIcon icon={["fas", !hideCategory && !hideType ? "fa-eye" : "fa-eye-slash"]} size="lg" />
			</button>
		</div>
	);
};

export default ModelType;
