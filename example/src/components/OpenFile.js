import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuButton from "./general/MenuButton";
import { useDispatch } from "react-redux";
import { loadStart, loadSuccess } from "../redux/loadSlice";
import { setJob } from "../redux/jobSlice";

const OpenFile = (props) => {
	const { job } = props;
	const dispatch = useDispatch();
	const fileRef = useRef(null);
	const handleOpenFile = (e) => {
		e.preventDefault();
		fileRef.current.click();
		dispatch(setJob(job));
	};
	const handleFileChange = (e) => {
		const url = e.target.files[0].name + e.target.files[0].size;
		const ifcURL = URL.createObjectURL(e.target.files[0]);
		const ifcInfo = {
			ifcURL: ifcURL,
			url: url,
		};
		dispatch(loadStart());
		dispatch(loadSuccess(ifcInfo));
		dispatch(setJob(0));
	};
	return (
		<>
			<MenuButton title={"Open File"} idTooltip={"openFile"} handleClick={handleOpenFile}>
				{<FontAwesomeIcon icon={["fa-solid", "fa-folder-open"]} size="lg" />}
			</MenuButton>
			<input type="file" accept=".ifc" style={{ display: "none" }} ref={fileRef} onChange={handleFileChange} />
		</>
	);
};

export default OpenFile;
