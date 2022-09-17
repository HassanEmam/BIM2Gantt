import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const GroupParameter = (props) => {
	const { groupName, itemProperties } = props;
	const [showGroup, setShowGroup] = useState(true);
	const handleShow = () => {
		setShowGroup(!showGroup);
	};
	return (
		<div className="property-group">
			<div className="d-flex justify-content-between property-group-title">
				<div>{groupName}</div>
				<div onClick={handleShow}>
					<FontAwesomeIcon icon={["fa-solid", showGroup ? "fa-angle-up" : "fa-angle-down"]} size="xs" />
				</div>
			</div>
			<div className="table-responsive" style={{ display: showGroup ? "block" : "none" }}>
				<table className="table table-bordered">
					<tbody>
						{itemProperties.map((item) => {
							return (
								<tr key={item.itemName}>
									<td>{item.itemName}</td>
									<td>
										<input type="text" className="form-control" disabled value={item.itemValue} />
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default GroupParameter;
