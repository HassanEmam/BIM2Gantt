import React from "react";
import OpenFile from "./OpenFile";
import Setting from "./Setting";

const Menu = (props) => {
	const { isLoad } = props;
	return (
		<div className="menu">
			<div className="d-flex justify-content-center">
				<div className="card card-menu">
					<OpenFile job={1} />
					<Setting job={2} />
				</div>
			</div>
		</div>
	);
};

export default Menu;
