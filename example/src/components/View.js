import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import { Modal } from "react-bootstrap";
import { DocumentModel } from "../doc/DocumentModel";
import { getIfcModelData, setIfcModelIds, setPropertySets } from "../redux/loadSlice";
import { setBuildingLevel } from "../redux/extensionSlice";
import { setJob } from "../redux/jobSlice";
import { storageIfcModelData, changePropertySets } from "../redux/storageSlice";

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
		</>
	);
};

export default View;
