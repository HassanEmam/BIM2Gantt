import React from "react";
import MenuButton from "../general/MenuButton";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../../redux/jobSlice";
import src from "../../assets/img/sectionBox.png";
const DefaultSB = (props) => {
	const { job } = props;
	const dispatch = useDispatch();
	const handleShow = () => {
		dispatch(setJob(job));
	};
	return (
		<>
			<MenuButton title={"Default Section Box"} idTooltip={"defaultSB"} handleClick={handleShow}>
				{<img src={src} alt="" />}
			</MenuButton>
		</>
	);
};

export default DefaultSB;