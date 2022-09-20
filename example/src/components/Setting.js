import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../redux/jobSlice";
import MenuButton from "./general/MenuButton";

const Setting = (props) => {
	const { job } = props;
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleOpenSetting = () => {
		dispatch(setJob(job));
		setShow(true);
	};
	const handleCloseSetting = () => {
		dispatch(setJob(0));
		setShow(false);
	};

	return (
		<>
			<MenuButton title={"Setting"} idTooltip={"setting"} handleClick={handleOpenSetting}>
				{<FontAwesomeIcon icon={["fas", "fa-cog"]} size="lg" />}
			</MenuButton>
		</>
	);
};

export default Setting;
