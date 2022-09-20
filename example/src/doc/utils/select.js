import { Vector3, BufferGeometry } from "three";
import { castElement, castMultiElement } from "./cast";
import { filterIfcModels, filterSectionBox } from "./filterModel";

function changeCursor() {
	return {
		default: (renderer) => {
			renderer.domElement.style.cursor = "default";
		},
		pointer: (renderer) => {
			renderer.domElement.style.cursor = "pointer";
		},
		move: (renderer) => {
			renderer.domElement.style.cursor = "move";
		},
	};
}
export function highlightIfcModel(job, event, ifc, view, material) {
	const found = job === 7 || job === 8 ? null : castElement(event, view, filterIfcModels(view.scene))[0];
	if (found) {
		changeCursor().pointer(view.renderer);
		view.preselectModel.id = found.object.modelID;
		view.expressID = ifc.getExpressId(found.object.geometry, found.faceIndex);
		var subset = ifc.createSubset({
			modelID: view.preselectModel.id,
			ids: [view.expressID],
			material: material,
			scene: view.scene,
			removePrevious: true,
			customID: -1,
		});
	} else {
		changeCursor().default(view.renderer);
		view.expressID = -1;
		ifc.removeSubset(view.preselectModel.id, material, -1);
	}
}
export function pickIfcModel(event, ifc, view, material) {
	const found = castElement(event, view, filterIfcModels(view.scene))[0];
	if (found) {
		view.preselectModel.id = found.object.modelID;
		view.expressID = ifc.getExpressId(found.object.geometry, found.faceIndex);
		view.subset = ifc.createSubset({
			modelID: view.preselectModel.id,
			ids: [view.expressID],
			material: material,
			scene: view.scene,
			customID: -2,
			removePrevious: !view.shiftSelect,
		});
		if (view.shiftSelect) view.multiExpressID.push(view.expressID);
		view.subset.geometry.computeBoundingBox();
		view.subset.geometry.computeBoundingSphere();
		var points = [];
		var posArray = view.subset.geometry.attributes.position;
		var index = view.subset.geometry.index.array;
		for (let i = 0; i < index.length; i++) {
			var x = posArray.getX(index[i]);
			var y = posArray.getY(index[i]);
			var z = posArray.getZ(index[i]);
			points.push(new Vector3(x, y, z));
		}
		var geo = new BufferGeometry().setFromPoints(points);
		geo.computeBoundingBox();
		geo.computeBoundingSphere();
		var center = geo.boundingSphere.center;
		view.pivot.visible = true;
		view.pivot.position.set(center.x, center.y, center.z);
		view.sectionBox.center = center;
		view.sectionBox.max = geo.boundingBox.max;
		view.sectionBox.min = geo.boundingBox.min;
		view.sectionBox.isSectionBox = true;
	} else {
		view.pivot.visible = false;
		view.expressID = -1;
		view.multiExpressID = [];
		ifc.removeSubset(view.preselectModel.id, material, -2);
	}
	return found;
}
export async function getPropertySets(ifc, view) {
	const propertySets = await ifc.getPropertySets(view.preselectModel.id, view.expressID, true);
	const props = propertySets.map((prop) => {
		if (prop.Name && prop.HasProperties && prop.HasProperties.length > 0) {
			return {
				groupName: prop.Name.value,
				itemProperties: prop.HasProperties.map((has) => {
					return {
						itemName: has.Name.value,
						itemValue: has.NominalValue.value,
					};
				}),
			};
		}
	});
	const type = await ifc.getItemProperties(view.preselectModel.id, view.expressID, true);
	return {
		expressID: view.expressID,
		type: type.constructor.name,
		props: props,
	};
}
