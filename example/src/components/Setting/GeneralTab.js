import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckItem from "./CheckItem";
const GeneralTab = () => {
	const dispatch = useDispatch();
	const [light, setLight] = useState(false);
	const handleChangeLight = () => {};
	return (
		<div className="content">
			<CheckItem
				name={"Light/Dark"}
				check={light}
				handleChange={handleChangeLight}
				id={"background-light"}
			></CheckItem>
		</div>
	);
};

export default GeneralTab;
