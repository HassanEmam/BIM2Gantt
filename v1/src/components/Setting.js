import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../redux/jobSlice";
import MenuButton from "./general/MenuButton";
import TabSetting from "./Setting/TabSetting";

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
			<Modal
				show={show}
				onHide={handleCloseSetting}
				animation={true}
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Setting</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<TabSetting></TabSetting>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-secondary" onClick={handleCloseSetting}>
						Close
					</button>
					<button className="btn btn-primary" onClick={handleCloseSetting}>
						Save
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default Setting;
