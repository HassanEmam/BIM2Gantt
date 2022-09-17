import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuButton from "../general/MenuButton";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../../redux/jobSlice";
const VisualExplore = () => {
	const dispatch = useDispatch();
	const handleShow = () => {
		dispatch(setJob(6));
	};
	return (
		<>
			<MenuButton title={"Visual Explore"} idTooltip={"visualExplore"} handleClick={handleShow}>
				{<FontAwesomeIcon icon={["fa-solid", "fa-clone"]} size="lg" />}
			</MenuButton>
		</>
	);
};

export default VisualExplore;
