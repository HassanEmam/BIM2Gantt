import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuButton from "../general/MenuButton";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../../redux/jobSlice";
const HideSB = (props) => {
	const { job } = props;
	const dispatch = useDispatch();
	const handleShow = () => {
		dispatch(setJob(job));
	};
	return (
		<>
			<MenuButton title={"Hide Section Box"} idTooltip={"hideSB"} handleClick={handleShow}>
				{<FontAwesomeIcon icon={["fa-solid", "fa-eye-slash"]} size="lg" />}
			</MenuButton>
		</>
	);
};

export default HideSB;
