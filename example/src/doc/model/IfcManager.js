import "../../assets/wasm/web-ifc-mt.wasm";
import "../../assets/wasm/web-ifc.wasm";
import { Matrix4, DoubleSide } from "three";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from "three-mesh-bvh";
import { IFCSPACE, IFCOPENINGELEMENT } from "web-ifc";

// import { downloadZip } from "client-zip";

export class IfcManager {
	constructor(scene, ifcModels) {
		this.scene = scene;
		this.ifcModels = ifcModels;
		this.ifcLoader = new IFCLoader();
		this.ifc = this.ifcLoader.ifcManager;
		this.ifc.setWasmPath("./wasm/");
		this.setupIfcLoader();
		// this.setupFileOpener();
	}

	remove = false;

	async editSubset(type) {
		const ids = await this.ifcLoader.ifcManager.getAllItemsOfType(0, type, false);
		if (this.remove) this.ifcLoader.ifcManager.removeFromSubset(0, ids);
		else this.ifcLoader.ifcManager.createSubset({ modelID: 0, ids, applyBVH: false, removePrevious: false });
	}

	setupThreeMeshBVH() {
		this.ifcLoader.ifcManager.setupThreeMeshBVH(computeBoundsTree, disposeBoundsTree, acceleratedRaycast);
	}

	async setupIfcLoader() {
		await this.ifcLoader.ifcManager.parser.setupOptionalCategories({
			[IFCSPACE]: false,
			[IFCOPENINGELEMENT]: false,
		});

		// await this.ifcLoader.ifcManager.useWebWorkers(true, 'IFCWorker.js');
		this.setupThreeMeshBVH();
	}

	setupFileOpener() {
		const input = document.querySelector('input[type="file"]');
		if (!input) return;
		input.addEventListener(
			"change",
			async (changed) => {
				await this.loadIFC(changed);
			},
			false
		);
	}

	async dispose() {
		this.ifcModels.length = 0;
		await this.ifcLoader.ifcManager.dispose();
		this.ifcLoader = null;
		this.ifcLoader = new IFCLoader();
		await this.setupIfcLoader();
	}

	subset = {};

	async loadIFC(ifcInfo, existIfcModelData, callback) {
		// this.ifc.setOnProgress((event) => console.log(event));

		const firstModel = Boolean(this.ifcModels.length === 0);

		await this.ifc.applyWebIfcConfig({
			COORDINATE_TO_ORIGIN: false,
			USE_FAST_BOOLS: true,
		});

		// const useFragments = document.getElementById("useFragment");

		// this.ifcLoader.ifcManager.useFragments = useFragments.checked;
		var _this = this;
		_this.ifcLoader.load(ifcInfo.ifcURL, async function (ifcModel) {
			ifcModel.geometry.computeBoundingBox();
			ifcModel.geometry.computeBoundingSphere();
			ifcModel.userData.changePlane = (planes) => {
				ifcModel.material.forEach((m) => {
					m.clippingPlanes = planes;
					m.side = DoubleSide;
				});
			};
			ifcModel.userData.transparent = ifcModel.material.map((m) => m.transparent);
			ifcModel.userData.opacity = ifcModel.material.map((m) => m.opacity);
			// ifcModel.material.forEach((m) => {
			// 	console.log(m);
			// });
			_this.ifcModels.push(ifcModel);
			_this.scene.add(ifcModel);
			if (firstModel) {
				const matrixArr = await _this.ifcLoader.ifcManager.ifcAPI.GetCoordinationMatrix(ifcModel.modelID);
				const matrix = new Matrix4().fromArray(matrixArr);
				_this.ifc.setupCoordinationMatrix(matrix);
			}
			if (existIfcModelData) {
				callback(existIfcModelData);
			} else {
				var SpatialStructure = await _this.ifc.getSpatialStructure(ifcModel.modelID);
				var structure = SpatialStructure.children[0].children[0].children;
				structure.forEach(async (s) => {
					const props = await _this.ifc.getItemProperties(ifcModel.modelID, s.expressID, true);
					s.Name = props.Name;
				});
				_this.getIfcModelData(ifcModel.modelID, function (categories) {
					const allCategories = Object.keys(categories);
					var ifcModelIds = [];
					allCategories.forEach((category) => {
						const typeKeys = Object.keys(categories[category].type);
						if (typeKeys && typeKeys.length > 0) {
							ifcModelIds = ifcModelIds.concat(categories[category].ids);
						}
					});
					callback({
						url: ifcInfo.url,
						structure: structure,
						categories: categories,
						ifcModelIds: ifcModelIds,
					});
				});
			}
		});
		// const ifcModel = await this.ifcLoader.loadAsync(ifcURL);

		// if (useFragments.checked) {
		// 	await this.downloadFragment(ifcModel);
		// }
	}
	data = {};
	getIfcModelData(i, callback) {
		var _this = this;
		var keys = Object.keys(_this.ifc.typesMap);

		var count = keys.length;
		keys.forEach(async function (e) {
			const data = await _this.ifc.getAllItemsOfType(i, parseInt(e), false); //lay category
			if (data.length > 0) {
				if (parseInt(e) !== 3124254112) {
					const props = await _this.ifc.getItemProperties(0, data[0], false);
					//lay ra element 3 d
					if (props["ObjectPlacement"] !== undefined && props["ObjectType"]) {
						if (!_this.data[_this.ifc.typesMap[e]]) {
							_this.data[_this.ifc.typesMap[e]] = {
								categoryName: _this.ifc.typesMap[e],
								categoryID: parseInt(e),
								ids: [],
								typeID: {},
								type: {},
								props: [],
							};

							for (let j = 0; j < data.length; j++) {
								const data0 = await _this.ifc.getTypeProperties(i, data[j]);
								if (data0[0]) {
									if (!_this.data[_this.ifc.typesMap[e]].type[data0[0].Name.value]) {
										_this.data[_this.ifc.typesMap[e]].type[data0[0].Name.value] = [];
									}
									if (!_this.data[_this.ifc.typesMap[e]].typeID[data0[0].Name.value]) {
										_this.data[_this.ifc.typesMap[e]].typeID[data0[0].Name.value] =
											data0[0].expressID;
									}

									_this.data[_this.ifc.typesMap[e]].type[data0[0].Name.value].push(data[j]);

									_this.data[_this.ifc.typesMap[e]].ids = _this.data[
										_this.ifc.typesMap[e]
									].ids.concat(data[j]);
								}
							}
						}
					}
				}
			}
			if (--count === 0) callback(_this.data);
		});
	}
	async downloadFragment(model) {
		const files = [];
		for (const frag of model.fragments) {
			const file = await frag.export();
			files.push(file.geometry, file.data);
		}

		const serializer = this.ifcLoader.ifcManager.properties.serializer;
		const propertyBlob = await serializer.serializeAllProperties(model.modelID);
		const propertyFile = new File(propertyBlob, "properties.json");

		files.push(new File([JSON.stringify(model.levelRelationships)], "levels-relationship.json"));
		files.push(new File([JSON.stringify(model.itemTypes)], "model-types.json"));
		files.push(new File([JSON.stringify(model.allTypes)], "all-types.json"));
		files.push(new File([JSON.stringify(model.floorsProperties)], "levels-properties.json"));

		const blob = await downloadZip(files).blob();
		const link = document.createElement("a");

		link.href = URL.createObjectURL(blob);
		link.download = "test.zip";
		link.click();

		link.href = URL.createObjectURL(propertyFile);
		link.download = "properties.json";
		link.click();

		link.remove();
	}
}
