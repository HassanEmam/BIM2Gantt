import React, { useRef, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { setBuildingLevel } from "../../../redux/extensionSlice";
import { hoverIfcModelIds } from "../../../redux/loadSlice";

const Level = (props) => {
	const { level, expressID, ids } = props;
	const dispatch = useDispatch();
	const buildingLevel = useSelector((state) => state.extension.buildingLevel);
	const levelChecked = () => {
		if (!buildingLevel) return false;
		var item = buildingLevel.find((b) => b.expressID === expressID);
		if (!item) return false;
		return item.checked;
	};

	const [checked, setChecked] = useState(levelChecked());

	const checkRef = useRef(null);
	const handleCheck = () => {
		if (buildingLevel) {
			let newBuildingLevel = [];
			for (let i = 0; i < buildingLevel.length; i++) {
				if (buildingLevel[i].expressID === expressID) {
					newBuildingLevel.push({ expressID: buildingLevel[i].expressID, checked: !checked });
				} else {
					newBuildingLevel.push({ expressID: buildingLevel[i].expressID, checked: false });
				}
			}
			dispatch(setBuildingLevel(newBuildingLevel));
			setChecked(!checked);
			checkRef.current.checked = !checked;
		}
	};

	const handleMouseEnter = () => {
		dispatch(hoverIfcModelIds(ids));
	};
	const handleMouseLeave = () => {
		dispatch(hoverIfcModelIds([]));
	};
	useEffect(() => {
		setChecked(levelChecked());
		checkRef.current.checked = levelChecked();
	}, [buildingLevel]);
	return (
		<button
			className="btn showObjectItem"
			onClick={handleCheck}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div className="d-flex justify-content-between">
				<div>{level}</div>
				<Form>
					<Form.Check type={"checkbox"}>
						<Form.Check.Input id={expressID} type={"checkbox"} defaultChecked={checked} ref={checkRef} />
					</Form.Check>
				</Form>
			</div>
		</button>
	);
};

export default Level;
