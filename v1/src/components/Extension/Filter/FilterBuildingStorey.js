import React from "react";
import FilterItem from "./FilterItem";
const FilterBuildingStorey = (props) => {
	const { listBuildingStorey, handleCheckFilterBuildingStorey } = props;
	const listFilterBuildingStorey = () => {
		if (listBuildingStorey) {
			return (
				<>
					{listBuildingStorey.map((build) => {
						return (
							<FilterItem
								key={build.id}
								name={build.name}
								id={build.id}
								checked={build.checked}
								handleCheck={handleCheckFilterBuildingStorey}
							/>
						);
					})}
				</>
			);
		} else {
			return <></>;
		}
	};
	return listFilterBuildingStorey();
};

export default FilterBuildingStorey;
