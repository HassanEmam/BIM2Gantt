import React from "react";

const ChartTitle = (props) => {
	const { fields, types, drawChart, handleFieldChange, handleTypeChange } = props;
	return (
		<>
			<div style={{ lineHeight: "33px", marginLeft: "5px", marginRight: "5px" }}>Field</div>
			<select className="form-select" style={{ width: "110px" }} onChange={handleFieldChange}>
				{fields.map((field) => {
					return (
						<option key={field} value={field}>
							{field}
						</option>
					);
				})}
			</select>
			<div style={{ lineHeight: "33px", marginLeft: "5px", marginRight: "5px" }}>Type</div>
			<select className="form-select" style={{ width: "110px" }} onChange={handleTypeChange}>
				{types.map((type) => {
					return (
						<option key={type} value={type}>
							{type.toUpperCase()}
						</option>
					);
				})}
			</select>
			<button className="btn btn-primary" onClick={drawChart}>
				Apply
			</button>
		</>
	);
};

export default ChartTitle;
