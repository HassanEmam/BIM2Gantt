import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../../redux/jobSlice";
import MenuButton from "../general/MenuButton";
import CardDraggable from "../general/CardDraggable";
import Level from "./BuildingStorey/Level";

const BuildingStorey = (props) => {
	const { job } = props;
	const dispatch = useDispatch();
	const [showCard, setShowCard] = useState(false);
	const structure = useSelector((state) => state.loadIFC.ifcModelData?.structure);
	const handleShow = () => {
		dispatch(setJob(job));
		setShowCard(true);
	};
	const handleClose = () => {
		dispatch(setJob(0));
		setShowCard(false);
	};
	const buildingStoreyContent = () => {
		if (structure) {
			return (
				<div className="modelBrowserContent">
					{structure.map((s) => {
						return (
							<div key={s.expressID}>
								<Level
									ids={s.children.map((child) => child.expressID)}
									level={s.Name.value}
									expressID={s.expressID}
									checked={false}
									// ids={s.children.map((c) => c.expressID)}
								></Level>
							</div>
						);
					})}
				</div>
			);
		} else {
			return <></>;
		}
	};
	return (
		<>
			<MenuButton title={"BuildingStorey"} idTooltip={"buildingStoreyTooltip"} handleClick={handleShow}>
				{<FontAwesomeIcon icon={["fa-solid", "fa-building"]} size="lg" />}
			</MenuButton>
			<CardDraggable
				visible={showCard}
				handleClose={handleClose}
				title={"BuildingStorey"}
				handle={"buildingStorey"}
			>
				{buildingStoreyContent()}
			</CardDraggable>
		</>
	);
};

export default BuildingStorey;
