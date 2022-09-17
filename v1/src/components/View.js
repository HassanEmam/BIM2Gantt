import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { Modal } from "react-bootstrap";
import { DocumentModel } from "../doc/DocumentModel";
import { getIfcModelData, setIfcModelIds, setPropertySets } from "../redux/loadSlice";
import { setBuildingLevel } from "../redux/extensionSlice";
import { setJob } from "../redux/jobSlice";
import { storageIfcModelData, changePropertySets } from "../redux/storageSlice";
import SearchBar from "./SearchBar";
import MouseRight from "./MouseRight";
import PropertyUI from "./Property/PropertyUI";

const View = () => {
	const dispatch = useDispatch();
	//show process Spinner
	const [showProcess, setShowProcess] = useState(false);
	//check ifcModel loaded
	const [isLoad, setIsLoad] = useState(false);
	// get store ifcInfo {ifcURL,url}
	const ifcInfo = useSelector((state) => state.loadIFC.ifcInfo);
	// configure job
	const job = useSelector((state) => state.job.job);
	// get allModelData storage ( only storage this data)
	const allModelData = useSelector((state) => state.storageIfcModelData.allModelData);
	// get store ifcModelData {ifcURL,url}
	const ifcModelIds = useSelector((state) => state.loadIFC.ifcModelData?.ifcModelIds);
	const highlightIfcModelIds = useSelector((state) => state.loadIFC.highlightIfcModelIds);
	const originIfcModelIds = useSelector((state) => state.loadIFC.originIfcModelIds);
	const categories = useSelector((state) => state.loadIFC.ifcModelData?.categories);
	const expressID = useSelector((state) => state.loadIFC.expressID);
	const filterExpressID = useSelector((state) => state.loadIFC.filterExpressID);

	const chartInfo = useSelector((state) => state.extension.chart);
	const buildingLevel = useSelector((state) => state.extension.buildingLevel);

	//#region create documentModel
	const [alpha, setAlpha] = useState(true);
	const mainView = useRef(null);
	const mainCanvas = useRef(null);
	const cubeView = useRef(null);
	const cubeCanvas = useRef(null);
	const [documentModel, setDocumentModel] = useState(null);

	var model;
	useEffect(() => {
		dispatch(setJob(0));
		model = new DocumentModel();
		model.initThreeDView(mainView.current, mainCanvas.current, alpha);
		model.initCubeControl(cubeView.current, cubeCanvas.current);
		const animate = () => {
			model.threeDView.animate();
			requestAnimationFrame(animate);
		};
		animate();
		setDocumentModel(model);
	}, []);

	//#endregion
	//#region load ifcModel
	useEffect(() => {
		if (ifcInfo && documentModel) {
			setShowProcess(true);
			//check data exist storage
			setIsLoad(false);
			const existIfcModelData = allModelData.find((m) => m.url === ifcInfo.url);
			documentModel.loadModel(ifcInfo, existIfcModelData, function (ifcModelData) {
				// get data building level
				documentModel.getBuildingLevel(ifcModelData.structure);
				// if not exist =>storage
				if (!existIfcModelData) dispatch(storageIfcModelData(ifcModelData));
				// storage in temp data
				dispatch(getIfcModelData(ifcModelData));
				dispatch(setBuildingLevel(documentModel.setBuildingLevel(ifcModelData.structure)));
				setShowProcess(false);
				setIsLoad(true);
			});
		}
	}, [ifcInfo]);
	//#endregion
	//#region  refresh when job=0
	useEffect(() => {
		if (isLoad) {
			if (job === 0) {
				documentModel.refreshJob();
				//refresh originIfcModelIds
				if (ifcModelIds && ifcModelIds.length != originIfcModelIds.length)
					dispatch(setIfcModelIds(originIfcModelIds));
			}
			if (job === 11) {
				documentModel.visibility(false);
			}
		}
	}, [job]);
	//#endregion
	//#region ModelBrowser
	useEffect(() => {
		if (isLoad) {
			documentModel.showSubset(ifcModelIds);
		}
	}, [ifcModelIds]);
	useEffect(() => {
		if (isLoad) {
			documentModel.highlightSubset(highlightIfcModelIds);
		}
	}, [highlightIfcModelIds]);
	//#endregion
	// #region BuildingStorey
	useEffect(() => {
		if (job === 4 && isLoad) {
			documentModel.changePlanesBuildingLevel(buildingLevel);
		}
	}, [buildingLevel]);
	//#endregion
	// #region chart
	useEffect(() => {
		if (documentModel && chartInfo && chartInfo.isDraw && categories && isLoad) {
			documentModel.drawChart(chartInfo, categories);
		}
	}, [chartInfo]);
	//#endregion
	// #region event
	useEffect(() => {
		if (isLoad) {
			documentModel.eventMouseMove(job);
			documentModel.eventMouseDown(job, function (eventMouseDown) {
				setShowMR(eventMouseDown.showMR);
				if (eventMouseDown.visibilityMR) setVisibilityMR(eventMouseDown.visibilityMR);
			});
		}
	}, [isLoad, job]);
	//#endregion
	//#region MouseRight
	const [visibilityMR, setVisibilityMR] = useState(defaultMouseRight());
	const [showMR, setShowMR] = useState(false);

	const handleIsolated = (e) => {
		setShowMR(false);
		documentModel.handleIsolated(function (hideMR) {
			setShowMR(hideMR);
		});
	};

	const [showPropertyUI, setShowPropertyUI] = useState(false);
	const [property, setProperty] = useState(null);
	const [titlePropertyUI, setTitlePropertyUI] = useState("");
	const handleProperty = async () => {
		setShowMR(false);
		setShowPropertyUI(true);
		await documentModel.handleProperty(categories, function (ifcType, propertySets, existProp) {
			if (!existProp) {
				dispatch(setPropertySets({ ifcType: ifcType, propertySets: propertySets }));
				dispatch(changePropertySets({ url: ifcInfo.url, ifcType: ifcType, propertySets: propertySets }));
			}
			setTitlePropertyUI(propertySets.type + " , ExpressID :" + propertySets.expressID);
			setProperty(propertySets);
			// documentModel.handleIsolated(function (hideMR) {});
		});
	};
	const handleClosePropertyUI = async () => {
		setShowPropertyUI(false);
	};
	const handleSelectAll = () => {
		setShowMR(false);
		documentModel.handleSelectAll(originIfcModelIds);
	};
	const handleSelectFilter = () => {
		setShowMR(false);
	};
	const handleShowAll = () => {
		setShowMR(false);
		documentModel.refreshJob();
	};
	//#endregion
	//#region filter
	useEffect(() => {
		if (expressID && expressID.length > 0 && job === 11) {
			documentModel.setFilter(expressID);
		}
	}, [expressID]);
	useEffect(() => {
		if (filterExpressID && filterExpressID.length > 0) {
			documentModel.setFilter(filterExpressID);
		}
	}, [filterExpressID]);
	//#endregion
	return (
		<>
			<div className="mainView" ref={mainView}>
				<canvas ref={mainCanvas}></canvas>
				<Menu isLoad={isLoad} />
			</div>
			<div className="cubeView" ref={cubeView}>
				<canvas ref={cubeCanvas}></canvas>
			</div>
			<Modal show={showProcess}>
				<div className="process">
					<div className="spinner-border" style={{ height: "100%", width: "100%" }}></div>
				</div>
			</Modal>
			{/* <Menu isLoad={isLoad} /> */}
			<SearchBar isLoad={isLoad} />
			{isLoad ? (
				<MouseRight
					showMR={showMR}
					visibilityMR={visibilityMR}
					handleIsolated={handleIsolated}
					handleProperty={handleProperty}
					handleSelectAll={handleSelectAll}
					handleSelectFilter={handleSelectFilter}
					handleShowAll={handleShowAll}
				/>
			) : (
				<></>
			)}
			{showPropertyUI ? (
				<PropertyUI
					showPropertyUI={showPropertyUI}
					handleClosePropertyUI={handleClosePropertyUI}
					titlePropertyUI={titlePropertyUI}
					property={property}
				/>
			) : (
				<></>
			)}
		</>
	);
};
function defaultMouseRight() {
	return {
		top: 0,
		left: 0,
		isolated: true,
		property: true,
		selectAll: true,
		selectFilter: true,
		showAll: true,
	};
}
export default View;
