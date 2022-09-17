import React, { useState } from "react";
import MenuButton from "../general/MenuButton";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../../redux/jobSlice";
import CardDraggable from "../general/CardDraggable";
import src from "../../assets/img/bar-chart-676.png";
import ChartTitle from "./VisualChart/ChartTitle";
import { defaultChart, generateChart } from "../../redux/extensionSlice";

const VisualChart = (props) => {
	const { job } = props;
	const dispatch = useDispatch();
	const [showCard, setShowCard] = useState(false);
	const fields = ["Category", "Type"];
	const types = ["bar", "doughnut", "pie", "polarArea"];
	const [selectField, setSelectField] = useState(fields[0]);
	const [selectType, setSelectType] = useState(types[0]);
	const handleShow = () => {
		setShowCard(true);
		dispatch(setJob(job));
		const chartInfo = {
			field: selectField,
			type: selectType,
		};
		dispatch(defaultChart(chartInfo));
	};
	const handleClose = () => {
		setShowCard(false);
		dispatch(setJob(0));
	};
	const handleFieldChange = (e) => {
		setSelectField(e.target.value);
	};
	const handleTypeChange = (e) => {
		setSelectType(e.target.value);
	};
	const drawChart = () => {
		const chartInfo = {
			field: selectField,
			type: selectType,
		};
		dispatch(generateChart(chartInfo));
	};
	const title = () => {
		return (
			<ChartTitle
				fields={fields}
				types={types}
				drawChart={drawChart}
				handleFieldChange={handleFieldChange}
				handleTypeChange={handleTypeChange}
			/>
		);
	};
	const chartContent = () => {
		return <div className="chartContent" id="contentChart"></div>;
	};
	return (
		<>
			<MenuButton title={"Chart"} idTooltip={"chart"} handleClick={handleShow}>
				{<img src={src} alt="" />}
			</MenuButton>
			<CardDraggable visible={showCard} handleClose={handleClose} title={title()} handle={"chart"}>
				{chartContent()}
			</CardDraggable>
		</>
	);
};

export default VisualChart;
