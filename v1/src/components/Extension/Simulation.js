import React, { useState } from "react";
import MenuButton from "../general/MenuButton";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../../redux/jobSlice";
import CardDraggable from "../general/CardDraggable";
import src from "../../assets/img/process.png";

const Simulation = () => {
	const dispatch = useDispatch();
	const [showCard, setShowCard] = useState(false);
	const handleShow = () => {
		dispatch(setJob(3));
		setShowCard(true);
	};
	const handleClose = () => {
		setShowCard(false);
	};
	return (
		<>
			<MenuButton title={"Simulation"} idTooltip={"simulation"} handleClick={handleShow}>
				{<img src={src} alt="" />}
			</MenuButton>
			<CardDraggable visible={showCard} handleClose={handleClose} title={"Simulation"} handle={"simulation"}>
				{}
			</CardDraggable>
		</>
	);
};

export default Simulation;
