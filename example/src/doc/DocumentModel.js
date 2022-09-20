import { Scene, BufferGeometry, Vector3 } from "three";
import { IfcManager, ChartModel, BuildingLevelModel, SettingModel } from "./model";
import { ThreeDView } from "./view/ThreeDView";
import { getUnits, highlightIfcModel, pickIfcModel, getPropertySets } from "./utils";
import { SectionBox } from "./model/SectionBox";

export class DocumentModel {
	constructor() {
		this.scene = new Scene();
		this.ifcModels = [];
		this.listLevel = [];
		this.ifcManager = new IfcManager(this.scene, this.ifcModels);
		this.settingModel = new SettingModel();
	}

	initThreeDView(container, canvas, alpha) {
		this.threeDView = new ThreeDView(this.scene, container, canvas, alpha);
	}
	initCubeControl(containerCube, canvasCube) {
		this.threeDView.initCubeControls(containerCube, canvasCube);
	}
	loadModel(ifcInfo, existIfcModelData, callback) {
		var _this = this;
		_this.ifcManager.loadIFC(ifcInfo, existIfcModelData, function (ifcModelData) {
			callback(ifcModelData);
		});
	}
	async getBuildingLevel(structure) {
		var _this = this;
		_this.units = await getUnits(_this.ifcManager.ifc, _this.ifcModels[0]);
		var maxY, minY;
		var factor = _this.units.length === "MILLI METRE" ? 0.001 : 1;
		for (let i = 0; i < structure.length; i++) {
			if (i === structure.length - 1) {
				maxY = _this.ifcModels[0].geometry.boundingBox.max.y;
			} else {
				const props = await _this.ifcManager.ifc.getItemProperties(0, structure[i + 1].expressID, true);
				maxY = factor * props.Elevation.value;
			}
			if (i === 0) {
				minY = _this.ifcModels[0].geometry.boundingBox.min.y;
			} else {
				const props = await _this.ifcManager.ifc.getItemProperties(0, structure[i].expressID, true);
				minY = factor * props.Elevation.value;
			}
			var ids = structure[i].children.map((child) => child.expressID);
			_this.listLevel.push({
				maxY: maxY,
				minY: minY,
				ids: ids,
				expressID: structure[i].expressID,
			});
		}

		this.buildingLevelModel = new BuildingLevelModel(
			_this.ifcModels[0].geometry.boundingBox.max.y,
			_this.ifcModels[0].geometry.boundingBox.min.y
		);
	}
	getSectionBox() {
		this.sectionBox = new SectionBox();
		
	}
	eventMouseMove(job) {
		var _this = this;
		_this.threeDView.renderer.domElement.addEventListener(
			"mousemove",
			function (e) {
				highlightIfcModel(job, e, _this.ifcManager.ifc, _this.threeDView, _this.settingModel.highlightMaterial);
			},
			false
		);
	}
	eventMouseDown(job, callback) {
		var _this = this;
		_this.threeDView.renderer.domElement.addEventListener(
			"mousedown",
			function (e) {
				if (job !== 7 || job !== 8) {
					if (e.which === 3)
						callback({
							showMR: true,
							visibilityMR: _this.threeDView.visibilityMR(e),
						});
					if (e.which === 1) {
						var found = pickIfcModel(
							e,
							_this.ifcManager.ifc,
							_this.threeDView,
							_this.settingModel.selectMaterial
						);
						console.log(found);
						// if (!found && !_this.isVisibility()) _this.visibility(true);
						callback({
							showMR: false,
							visibilityMR: null,
						});
					}
				}
			},
			false
		);
	}
	//#region
	handleIsolated(callback) {
		var _this = this;
		if (_this.threeDView.expressID === -1) {
			callback(false);
			return;
		}
		_this.visibility(false);
		_this.subset = _this.ifcManager.ifc.createSubset({
			modelID: _this.threeDView.preselectModel.id === -1 ? 0 : _this.threeDView.preselectModel.id,
			ids:
				_this.threeDView.multiExpressID.length > 0
					? _this.threeDView.multiExpressID
					: [_this.threeDView.expressID],
			scene: _this.scene,
			removePrevious: true,
			customID: -1,
		});
		_this.subset.userData.IFCModel = true;
	}
	async handleProperty(categories, callback) {
		const ifcType = await this.ifcManager.ifc.getIfcType(
			this.threeDView.preselectModel.id,
			this.threeDView.expressID
		);
		var item = categories[ifcType].props.find((p) => p.expressID === this.threeDView.expressID);
		if (item) {
			callback(null, item, true);
		} else {
			callback(ifcType, await getPropertySets(this.ifcManager.ifc, this.threeDView), false);
		}
	}
	handleSelectAll(originIfcModelIds) {
		if (originIfcModelIds) {
			var _this = this;
			_this.visibility(false);
			_this.subset = _this.ifcManager.ifc.createSubset({
				modelID: _this.threeDView.preselectModel.id === -1 ? 0 : _this.threeDView.preselectModel.id,
				ids: originIfcModelIds,
				material: _this.settingModel.selectMaterial,
				scene: _this.scene,
				removePrevious: true,
				customID: -1,
			});
			_this.subset.userData.IFCModel = true;
		}
	}
	handleSelectFilter() {}
	//#endregion
	setBuildingLevel(structure) {
		return structure.map((s) => {
			return { expressID: s.expressID, checked: false };
		});
	}
	visibility(visible) {
		for (let i = 0; i < this.ifcModels.length; i++) {
			const ifcModel = this.ifcModels[i];
			ifcModel.visible = visible;
		}
	}
	isVisibility() {
		for (let i = 0; i < this.ifcModels.length; i++) {
			const ifcModel = this.ifcModels[i];
			if (ifcModel.visible === false) return false;
		}
		return true;
	}

	showSubset(ifcModelIds) {
		this.visibility(false);
		this.subset = this.ifcManager.ifc.createSubset({
			modelID: this.threeDView.preselectModel.id === -1 ? 0 : this.threeDView.preselectModel.id,
			ids: ifcModelIds,
			scene: this.scene,
			removePrevious: true,
			customID: -1,
		});
		this.subset.userData.IFCModel = true;
	}
	highlightSubset(highlightIfcModelIds) {
		if (highlightIfcModelIds.length > 0) {
			this.subset = this.ifcManager.ifc.createSubset({
				modelID: this.threeDView.preselectModel.id === -1 ? 0 : this.threeDView.preselectModel.id,
				ids: highlightIfcModelIds,
				scene: this.scene,
				removePrevious: true,
				material: this.settingModel.highlightMaterial,
				customID: -1,
			});
			this.subset.userData.IFCModel = true;
		} else {
			this.subset.removeFromParent();
		}
	}
	drawChart(chartInfo, categories) {
		if (this.ifcModels.length > 0) {
			this.chartModel = new ChartModel(categories);
			this.chartModel.drawChart(
				chartInfo.field,
				chartInfo.type,
				this.scene,
				this.subset,
				this.ifcManager.ifc,
				this.ifcModels[0]
			);
		}
	}
	changePlanesBuildingLevel(buildingLevel) {
		var _this = this;
		_this.ifcModels.forEach((ifcModel) => {
			ifcModel.userData.changePlane([_this.buildingLevelModel.top, _this.buildingLevelModel.bottom]);
		});
		var levelChecked = buildingLevel.find((b) => b.checked);
		if (levelChecked) {
			var level = _this.listLevel.find((l) => l.expressID === levelChecked.expressID);
			if (level) {
				_this.buildingLevelModel.update(level.maxY, level.minY);
			}
		} else {
			_this.buildingLevelModel.update(
				_this.ifcModels[0].geometry.boundingBox.max.y,
				_this.ifcModels[0].geometry.boundingBox.min.y
			);
		}
	}
	filter() {
		if (this.ifcModels.length > 0) {
			this.ifcModels.forEach((ifcModel) => {
				// ifcModel.geometry.wireframe = true;
				ifcModel.material.forEach((m) => {
					m.transparent = true;
					m.opacity = 0.05;
				});
			});
		}
	}
	setFilter(expressID) {
		this.visibility(false);
		this.threeDView.multiExpressID = expressID;
		this.subset = this.ifcManager.ifc.createSubset({
			modelID: this.threeDView.preselectModel.id === -1 ? 0 : this.threeDView.preselectModel.id,
			ids: this.threeDView.multiExpressID,
			scene: this.scene,
			removePrevious: true,
			// material: this.settingModel.highlightMaterial,
			customID: -1,
		});
		this.subset.userData.IFCModel = true;
	}
	refreshJob() {
		if (this.ifcModels.length > 0) {
			this.threeDView.refreshJob();
			if (!this.isVisibility()) this.visibility(true);
			if (this.subset) this.subset.removeFromParent();
			this.ifcModels.forEach((ifcModel) => {
				ifcModel.userData.changePlane([]);
				// ifcModel.geometry.wireframe = false;
				for (let i = 0; i < ifcModel.material.length; i++) {
					ifcModel.material[i].transparent = ifcModel.userData.transparent[i];
					ifcModel.material[i].opacity = ifcModel.userData.opacity[i];
				}
			});
		}
	}
}
