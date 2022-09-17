import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import ModelType from "./ModelType";
import { setIfcModelIds, hoverIfcModelIds } from "../../../redux/loadSlice";

const ModelCategory = (props) => {
	const { categoryName, type, ids } = props;
	const dispatch = useDispatch();
	const ifcModelIds = useSelector((state) => state.loadIFC.ifcModelData?.ifcModelIds);
	const [showType, setShowType] = useState(false);
	const [hideCategory, setHideCategory] = useState(false);
	const handleShow = () => {
		setShowType(!showType);
	};
	const modelTypes = () => {
		if (type) {
			const allTypes = Object.keys(type);
			return (
				<div style={{ display: showType ? "block" : "none" }}>
					{allTypes.map((t) => {
						return <ModelType key={t} ids={type[t]} typeName={t} hideCategory={hideCategory}></ModelType>;
					})}
				</div>
			);
		} else {
			return <></>;
		}
	};
	const handleClick = () => {
		setHideCategory(!hideCategory);

		if (ids.length > 0) {
			var newIfcModelIds = ifcModelIds;

			if (hideCategory) {
				newIfcModelIds = newIfcModelIds.concat(ids);
			} else {
				newIfcModelIds = newIfcModelIds.filter((e) => {
					return ids.indexOf(e) < 0;
				});
			}
			dispatch(setIfcModelIds(newIfcModelIds));
		}
	};
	const handleMouseEnter = () => {
		dispatch(hoverIfcModelIds(ids));
	};
	const handleMouseLeave = () => {
		dispatch(hoverIfcModelIds([]));
	};
	return (
		<>
			<div className="d-flex justify-content-between modelCategory">
				<button
					className="btn showObjectItem"
					onClick={handleShow}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div style={{ display: "inline", margin: "0 5px" }}>
						<FontAwesomeIcon icon={["fas", showType ? "fa-arrow-up" : "fa-arrow-down"]} size="xs" />
					</div>
					{categoryName}
				</button>
				<button className="btn eyes" onClick={handleClick}>
					<FontAwesomeIcon icon={["fas", !hideCategory ? "fa-eye" : "fa-eye-slash"]} size="lg" />
				</button>
			</div>
			<div className="modelType">{modelTypes()}</div>
		</>
	);
};

export default ModelCategory;
