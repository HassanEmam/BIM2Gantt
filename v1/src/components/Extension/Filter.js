import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../../redux/jobSlice";
import MenuButton from "../general/MenuButton";
import FilterTab from "./Filter/FilterTab";
import CardDraggable from "../general/CardDraggable";

const Filter = (props) => {
	const { job } = props;
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleShow = () => {
		dispatch(setJob(job));
		setShow(true);
	};
	const handleClose = () => {
		dispatch(setJob(0));
		setShow(false);
	};

	return (
		<>
			<MenuButton title={"Filter"} idTooltip={"filterTooltip"} handleClick={handleShow}>
				{<FontAwesomeIcon icon={["fa-solid", "fa-filter"]} size="lg" />}
			</MenuButton>
			<CardDraggable visible={show} handleClose={handleClose} title={"Filter"} handle={"filter"}>
				{<FilterTab showTab={show} />}
			</CardDraggable>
			{/* <Modal size="lg" show={show} onHide={handleClose} animation={true}>
				<Modal.Header closeButton>
					<Modal.Title>Filter</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<FilterTab />
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-secondary" onClick={handleClose}>
						Close
					</button>
					<button className="btn btn-primary" onClick={handleClose}>
						Save
					</button>
				</Modal.Footer>
			</Modal> */}
		</>
	);
};

export default Filter;
