import React from "react";

const FilterExpressID = (props) => {
	const { originIfcModelIds, handleCheckFilterExpressID } = props;
	const listFilterExpressID = () => {
		if (originIfcModelIds) {
			return (
				<>
					{originIfcModelIds.map((id) => {
						return (
							<div
								className="expressIDFilter"
								id={id}
								express={0}
								key={id}
								onClick={handleCheckFilterExpressID}
							>
								{id}
							</div>
						);
					})}
				</>
			);
		} else {
			return <></>;
		}
	};
	return listFilterExpressID();
};

export default FilterExpressID;
