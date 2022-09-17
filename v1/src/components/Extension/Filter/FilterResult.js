import React from "react";

const FilterResult = (props) => {
	const { resultIds, handleCheckFilterResult } = props;
	const listResult = () => {
		if (resultIds) {
			return (
				<>
					{resultIds.map((id) => {
						return (
							<div
								className="expressIDFilter"
								id={id}
								express={0}
								key={id}
								onClick={handleCheckFilterResult}
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
	return listResult();
};

export default FilterResult;
