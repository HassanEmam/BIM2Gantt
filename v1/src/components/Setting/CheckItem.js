import React from "react";
import Form from "react-bootstrap/Form";

const CheckItem = (props) => {
	const { name, check, handleChange, id } = props;
	return (
		<div className="d-flex justify-content-between">
			<div>{name}</div>
			<Form>
				<Form.Check type="switch" id={id} defaultChecked={check} value={check} onChange={handleChange} />
			</Form>
		</div>
	);
};

export default CheckItem;
