import React from "react";
import MenuButton from "../general/MenuButton";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../../redux/jobSlice";
import src from "../../assets/img/boxes-icon.png";
const ItemSB = (props) => {
	const { job } = props;
	const dispatch = useDispatch();
	const handleShow = () => {
		dispatch(setJob(job));
	};
	return (
		<>
			<MenuButton title={"Item Section Box"} idTooltip={"itemSB"} handleClick={handleShow}>
				{<img src={src} alt="" />}
			</MenuButton>
		</>
	);
};

export default ItemSB;
