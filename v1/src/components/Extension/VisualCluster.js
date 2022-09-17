import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuButton from "../general/MenuButton";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../../redux/jobSlice";

const VisualCluster = (props) => {
	const { job } = props;
	const dispatch = useDispatch();
	const handleShow = () => {
		dispatch(setJob(job));
	};
	return (
		<>
			<MenuButton title={"Visual Cluster"} idTooltip={"visualCluster"} handleClick={handleShow}>
				{<FontAwesomeIcon icon={["fa-solid", "fa-layer-group"]} size="lg" />}
			</MenuButton>
		</>
	);
};

export default VisualCluster;
