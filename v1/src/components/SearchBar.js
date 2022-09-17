import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const SearchBar = (props) => {
	const { isLoad } = props;
	return (
		<>
			{isLoad ? (
				<>
					<div className="menuSearch">
						<div className="d-flex justify-content-center">
							<div className="card card-menu">
								<InputGroup>
									<Form.Control
										placeholder="Search"
										aria-label="Recipient's username"
										aria-describedby="basic-addon2"
									/>
									<button className="btn btn-primary btn-search">
										{<FontAwesomeIcon icon={["fas", "fa-search"]} size="lg" />}
									</button>
								</InputGroup>
							</div>
						</div>
					</div>
				</>
			) : (
				<></>
			)}
		</>
	);
};

export default SearchBar;
