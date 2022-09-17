import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../../redux/jobSlice";
import MenuButton from "../general/MenuButton";
import CardDraggable from "../general/CardDraggable";
import ModelCategory from "./ModelBrowser/ModelCategory";

const ModelBrowser = (props) => {
	const { job } = props;
	const dispatch = useDispatch();
	const categories = useSelector((state) => state.loadIFC.ifcModelData?.categories);
	const [showCard, setShowCard] = useState(false);
	const handleShow = () => {
		dispatch(setJob(job));
		setShowCard(true);
	};
	const handleClose = () => {
		dispatch(setJob(0));
		setShowCard(false);
	};

	const modelBrowser = () => {
		if (categories) {
			const allCategories = Object.keys(categories);

			return (
				<div className="modelBrowserContent">
					<div>
						{allCategories.map((category) => {
							const typeKeys = Object.keys(categories[category].type);
							if (typeKeys && typeKeys.length > 0) {
								return (
									<ModelCategory
										key={categories[category].categoryID}
										categoryName={category}
										type={categories[category].type}
										ids={categories[category].ids}
									></ModelCategory>
								);
							}
						})}
					</div>
				</div>
			);
		} else {
			return <></>;
		}
	};
	return (
		<>
			<MenuButton title={"Model Browser"} idTooltip={"modelBrowserTooltip"} handleClick={handleShow}>
				{<FontAwesomeIcon icon={["fa-solid", "fa-sitemap"]} size="lg" />}
			</MenuButton>
			<CardDraggable visible={showCard} handleClose={handleClose} title={"Model Browser"} handle={"modelBrowser"}>
				{modelBrowser()}
			</CardDraggable>
		</>
	);
};

export default ModelBrowser;
