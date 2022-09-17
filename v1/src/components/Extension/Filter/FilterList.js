import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FilterList = (props) => {
	const { filterLists, handleFilterChoose, handleFilterDelete } = props;
	const getFilterList = () => {
		if (filterLists) {
			return (
				<>
					{filterLists.map((filter) => {
						return (
							<tr key={filter.name}>
								<td className="filterStorage" onClick={handleFilterChoose} name={filter.name}>
									{filter.name}
								</td>
								<td className="filterStorage" onClick={handleFilterDelete} name={filter.name}>
									<div>
										<FontAwesomeIcon icon={["fas", "fa-trash"]} size="lg" />
									</div>
								</td>
							</tr>
						);
					})}
				</>
			);
		} else {
			return <></>;
		}
	};
	return (
		<div className="table-responsive">
			<table className="table table-bordered">
				<thead>
					<tr>
						<th>Name</th>
						<th style={{ width: "50px" }}>
							Delete
							{/* <div>
								<FontAwesomeIcon icon={["fas", "fa-trash"]} size="lg" />
							</div> */}
						</th>
					</tr>
				</thead>
				<tbody>{getFilterList()}</tbody>
			</table>
		</div>
	);
};

export default FilterList;
