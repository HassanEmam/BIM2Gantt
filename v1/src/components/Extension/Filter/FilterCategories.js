import React from "react";
import FilterItem from "./FilterItem";

const FilterCategories = (props) => {
	const { listCategories, handleCheckCategories } = props;
	const listFilterCategories = () => {
		if (listCategories) {
			return (
				<>
					{listCategories.map((category) => {
						return (
							<FilterItem
								key={category.id}
								name={category.name}
								id={category.id}
								checked={category.checked}
								handleCheck={handleCheckCategories}
							/>
						);
					})}
				</>
			);
		} else {
			return <></>;
		}
	};
	return listFilterCategories();
};

export default FilterCategories;
