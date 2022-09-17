import React from "react";
import FilterItem from "./FilterItem";
const FilterTypes = (props) => {
	const { listTypes, handleCheckFilterTypes } = props;
	const listFilterTypes = () => {
		if (listTypes) {
			return (
				<>
					{listTypes.map((type) => {
						return (
							<FilterItem
								key={type.id}
								name={type.name}
								id={type.id}
								checked={type.checked}
								handleCheck={handleCheckFilterTypes}
							/>
						);
					})}
				</>
			);
		} else {
			return <></>;
		}
	};
	return listFilterTypes();
};

export default FilterTypes;
