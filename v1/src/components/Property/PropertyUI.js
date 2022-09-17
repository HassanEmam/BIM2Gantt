import React, { useEffect, useState } from "react";
import CardDraggable from "./../general/CardDraggable";
import GroupParameter from "./GroupParameter";

const PropertyUI = (props) => {
	const { showPropertyUI, handleClosePropertyUI, titlePropertyUI, property } = props;
	const createContent = () => {
		if (property) {
			return (
				<div className="propertyContent">
					{property.props.map((prop) => {
						return (
							<GroupParameter
								key={prop.groupName}
								groupName={prop.groupName}
								itemProperties={prop.itemProperties}
							/>
						);
					})}
				</div>
			);
		} else {
			return <></>;
		}
	};
	const [content, setContent] = useState(createContent());
	useEffect(() => {
		setContent(createContent());
	}, [property]);
	return (
		<CardDraggable
			visible={showPropertyUI}
			handleClose={handleClosePropertyUI}
			title={titlePropertyUI}
			handle={"propertyUI"}
		>
			{content}
		</CardDraggable>
	);
};

export default PropertyUI;
