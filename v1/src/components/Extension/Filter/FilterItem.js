import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
const FilterItem = (props) => {
	const { name, id, checked, handleCheck } = props;
	const [show, setShow] = useState(false);
	const target = useRef(null);
	return (
		<div className="d-flex justify-content-start" style={{ margin: "5px" }}>
			<Form>
				<Form.Check type={"checkbox"}>
					<Form.Check.Input id={id} type={"checkbox"} defaultChecked={checked} onClick={handleCheck} />
				</Form.Check>
			</Form>
			<div
				className="filterItemName"
				ref={target}
				onMouseLeave={() => setShow(false)}
				onMouseMove={() => setShow(true)}
			>
				{name}
			</div>
			<Overlay target={target.current} show={show} placement="right">
				{(props) => (
					<Tooltip id={id + "tooltip"} {...props}>
						{name}
					</Tooltip>
				)}
			</Overlay>
		</div>
	);
};

export default FilterItem;
