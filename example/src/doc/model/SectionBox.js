import {
	BufferGeometry,
	BufferAttribute,
	Line,
	Plane,
	PlaneGeometry,
	Vector3,
	Mesh,
	ConeGeometry,
	CylinderGeometry,
	Group,
} from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { PlaneModelMaterial } from "../material";
import {
	createLineVertices,
	createPlaneVertices,
	updateLineVertices,
	updatePlanVertices,
	initializePlaneMesh,
	initializeOutline,
	transformLeft,
	transformRight,
	transformFront,
	transformBack,
	transformTop,
	transformBottom,
} from "../utils";
const factor = 0.1;
export class SectionBox {
	constructor() {
		this.max;
		this.min;
	}
	createNewMaxMin(max, min) {
		var deltaX = Math.abs(max.x - min.x) * factor;
		var deltaY = Math.abs(max.y - min.y) * factor;
		var deltaZ = Math.abs(max.z - min.z) * factor;
		this.max = new Vector3(max.x + deltaX, max.y + deltaY, max.z + deltaZ);
		this.min = new Vector3(min.x - deltaX, min.y - deltaY, min.z - deltaZ);
	}

	action(mainView, ifcModel) {
		var _this = this;
		$(_this.itemBtn).on("click", function () {
			if (mainView.multiExpressID.length > 0) {
				alert("can not compute Section Box");
				return;
			}
			mainView.isTransform = true;
			if (!mainView.sectionBox.isSectionBox) {
				mainView.sectionBox.center = ifcModel.geometry.boundingSphere.center;
				mainView.sectionBox.max = ifcModel.geometry.boundingBox.max;
				mainView.sectionBox.min = ifcModel.geometry.boundingBox.min;
				mainView.sectionBox.isSectionBox = true;
			}
			if (!_this.planeModels) {
				_this.init(mainView);
				$(_this.hideBtn).show();
			} else {
				_this.planeModels.update(mainView);
			}
			_this.planeModels.visibility(true, ifcModel);
		});
		$(_this.defaultBtn).on("click", function () {
			if (mainView.multiExpressID.length > 0) {
				alert("can not compute Section Box");
				return;
			}
			mainView.isTransform = true;
			mainView.sectionBox.center = ifcModel.geometry.boundingSphere.center;
			mainView.sectionBox.max = ifcModel.geometry.boundingBox.max;
			mainView.sectionBox.min = ifcModel.geometry.boundingBox.min;
			mainView.sectionBox.isSectionBox = true;
			if (!_this.planeModels) {
				_this.init(mainView);
				$(_this.hideBtn).show();
			} else {
				_this.planeModels.update(mainView);
			}
			_this.planeModels.visibility(true, ifcModel);
		});
		$(_this.hideBtn).on("click", function () {
			if (_this.planeModels) {
				mainView.isTransform = false;
				_this.planeModels.visibility(false, ifcModel);
			}
		});
	}
	init(mainView) {
		var max = mainView.sectionBox.max;
		var min = mainView.sectionBox.min;
		var deltaX = Math.abs(max.x - min.x) * factor;
		var deltaY = Math.abs(max.y - min.y) * factor;
		var deltaZ = Math.abs(max.z - min.z) * factor;
		var maxModel = new Vector3(max.x + deltaX, max.y + deltaY, max.z + deltaZ);
		var minModel = new Vector3(min.x - deltaX, min.y - deltaY, min.z - deltaZ);
		var left = new PlaneModel(mainView.scene, maxModel, minModel, 1);
		var right = new PlaneModel(mainView.scene, maxModel, minModel, 2);
		var front = new PlaneModel(mainView.scene, maxModel, minModel, 3);
		var back = new PlaneModel(mainView.scene, maxModel, minModel, 4);
		var top = new PlaneModel(mainView.scene, maxModel, minModel, 5);
		var bottom = new PlaneModel(mainView.scene, maxModel, minModel, 6);
		var outlineVector = initializeOutline(maxModel, minModel);
		var outlines = this.createOutline(mainView.scene, outlineVector);
		this.planeModels = {
			max: maxModel,
			min: minModel,
			left: left,
			right: right,
			front: front,
			back: back,
			top: top,
			bottom: bottom,
			planes: () => [
				this.planeModels.left.plane,
				this.planeModels.right.plane,
				this.planeModels.front.plane,
				this.planeModels.back.plane,
				this.planeModels.top.plane,
				this.planeModels.bottom.plane,
			],
			outlineVector: outlineVector,
			outLines: outlines,
			update: (mainView) => {
				this.updatePlaneModels(mainView);
			},
			visibility: (visible, ifcModel) => {
				this.visibility(visible, ifcModel);
			},
		};
		this.actionTransFormControl();
	}
	createOutline(scene, outline) {
		let outlines = [];
		outlines.push(new PlaneOutline(scene, outline.v1, outline.v2, 0));
		outlines.push(new PlaneOutline(scene, outline.v2, outline.v4, 1));
		outlines.push(new PlaneOutline(scene, outline.v4, outline.v3, 2));
		outlines.push(new PlaneOutline(scene, outline.v3, outline.v1, 3));

		outlines.push(new PlaneOutline(scene, outline.v1, outline.v5, 4));
		outlines.push(new PlaneOutline(scene, outline.v2, outline.v6, 5));
		outlines.push(new PlaneOutline(scene, outline.v4, outline.v8, 6));
		outlines.push(new PlaneOutline(scene, outline.v3, outline.v7, 7));

		outlines.push(new PlaneOutline(scene, outline.v5, outline.v6, 8));
		outlines.push(new PlaneOutline(scene, outline.v6, outline.v8, 9));
		outlines.push(new PlaneOutline(scene, outline.v8, outline.v7, 10));
		outlines.push(new PlaneOutline(scene, outline.v7, outline.v5, 11));
		return outlines;
	}

	updatePlaneModels(mainView) {
		var max = mainView.sectionBox.max;
		var min = mainView.sectionBox.min;
		var deltaX = Math.abs(max.x - min.x) * factor;
		var deltaY = Math.abs(max.y - min.y) * factor;
		var deltaZ = Math.abs(max.z - min.z) * factor;
		this.planeModels.max = new Vector3(max.x + deltaX, max.y + deltaY, max.z + deltaZ);
		this.planeModels.min = new Vector3(min.x - deltaX, min.y - deltaY, min.z - deltaZ);

		this.planeModels.left.update(this.planeModels.max, this.planeModels.min);
		this.planeModels.right.update(this.planeModels.max, this.planeModels.min);
		this.planeModels.front.update(this.planeModels.max, this.planeModels.min);
		this.planeModels.back.update(this.planeModels.max, this.planeModels.min);
		this.planeModels.top.update(this.planeModels.max, this.planeModels.min);
		this.planeModels.bottom.update(this.planeModels.max, this.planeModels.min);

		this.planeModels.outlineVector = initializeOutline(this.planeModels.max, this.planeModels.min);
		this.planeModels.outLines[0].update(this.planeModels.outlineVector.v1, this.planeModels.outlineVector.v2);
		this.planeModels.outLines[1].update(this.planeModels.outlineVector.v2, this.planeModels.outlineVector.v4);
		this.planeModels.outLines[2].update(this.planeModels.outlineVector.v4, this.planeModels.outlineVector.v3);
		this.planeModels.outLines[3].update(this.planeModels.outlineVector.v3, this.planeModels.outlineVector.v1);
		this.planeModels.outLines[4].update(this.planeModels.outlineVector.v1, this.planeModels.outlineVector.v5);
		this.planeModels.outLines[5].update(this.planeModels.outlineVector.v2, this.planeModels.outlineVector.v6);
		this.planeModels.outLines[6].update(this.planeModels.outlineVector.v4, this.planeModels.outlineVector.v8);
		this.planeModels.outLines[7].update(this.planeModels.outlineVector.v3, this.planeModels.outlineVector.v7);
		this.planeModels.outLines[8].update(this.planeModels.outlineVector.v5, this.planeModels.outlineVector.v6);
		this.planeModels.outLines[9].update(this.planeModels.outlineVector.v6, this.planeModels.outlineVector.v8);
		this.planeModels.outLines[10].update(this.planeModels.outlineVector.v8, this.planeModels.outlineVector.v7);
		this.planeModels.outLines[11].update(this.planeModels.outlineVector.v7, this.planeModels.outlineVector.v5);
	}
	visibility(visible, ifcModel) {
		this.planeModels.left.visibility(visible);
		this.planeModels.right.visibility(visible);
		this.planeModels.front.visibility(visible);
		this.planeModels.back.visibility(visible);
		this.planeModels.top.visibility(visible);
		this.planeModels.bottom.visibility(visible);
		this.planeModels.outLines.forEach((o) => o.visibility(visible));
		ifcModel.userData.changePlane(visible ? this.planeModels.planes() : []);
	}
	actionTransFormControl() {
		transformLeft(this.planeModels);
		transformRight(this.planeModels);
		transformFront(this.planeModels);
		transformBack(this.planeModels);
		transformTop(this.planeModels);
		transformBottom(this.planeModels);
	}
}

class PlaneModel {
	constructor(scene, max, min, type) {
		this.type = type;
		this.vertices = createPlaneVertices();
		this.geometry = new BufferGeometry();
		this.geometry.setAttribute("position", new BufferAttribute(this.vertices, 3));
		this.planeMesh = new Mesh(this.geometry, PlaneModelMaterial.normalPlane);
		this.planeMesh.renderOrder = 1;

		scene.add(this.planeMesh);
		this.init(scene, max, min);
	}
	init(scene, max, min) {
		this.vector = initializePlaneMesh(max, min, this.type);

		updatePlanVertices(
			this.vertices,
			this.vector.v1,
			this.vector.v2,
			this.vector.v3,
			this.vector.v4,
			this.planeMesh
		);
		// this.plane = new Plane(this.vector.normal, -Math.abs(this.vector.dis));
		this.plane = new Plane(this.vector.normal, this.vector.constant);
		this.center = this.computeCenter(this.vector.v1, this.vector.v2, this.vector.v3, this.vector.v4);
		this.control = new PlaneControl(scene, this.center, this.type);
		this.vector.rotation(this.control.group);
	}
	update(max, min) {
		this.vector = initializePlaneMesh(max, min, this.type);
		updatePlanVertices(
			this.vertices,
			this.vector.v1,
			this.vector.v2,
			this.vector.v3,
			this.vector.v4,
			this.planeMesh
		);
		this.plane.constant = this.vector.constant;
		this.center = this.computeCenter(this.vector.v1, this.vector.v2, this.vector.v3, this.vector.v4);
		this.control.update(this.center);
	}

	computeCenter(v1, v2, v3, v4) {
		var x = (v1.x + v2.x + v3.x + v4.x) / 4;
		var y = (v1.y + v2.y + v3.y + v4.y) / 4;
		var z = (v1.z + v2.z + v3.z + v4.z) / 4;
		return new Vector3(x, y, z);
	}
	computeCenterVertices() {
		var x = (this.vertices[0] + this.vertices[3] + this.vertices[6] + this.vertices[15]) / 4;
		var y = (this.vertices[1] + this.vertices[4] + this.vertices[7] + this.vertices[16]) / 4;
		var z = (this.vertices[2] + this.vertices[5] + this.vertices[8] + this.vertices[17]) / 4;
		return new Vector3(x, y, z);
	}
	visibility(visible) {
		this.planeMesh.visible = visible;
		this.control.group.visible = visible;
	}
}
class PlaneOutline {
	constructor(scene, v1, v2, type) {
		this.type = type;
		this.vertices = createLineVertices();
		this.geometry = new BufferGeometry();
		this.geometry.setAttribute("position", new BufferAttribute(this.vertices, 3));
		this.line = new Line(this.geometry, PlaneModelMaterial.outLine);
		this.line.computeLineDistances();

		scene.add(this.line);
		updateLineVertices(this.vertices, v1, v2, this.line);
	}
	visibility(visible) {
		this.line.visible = visible;
	}
	update(v1, v2) {
		updateLineVertices(this.vertices, v1, v2, this.line);
	}
}

class PlaneControl {
	constructor(scene, center, type) {
		this.type = type;
		var cone = new ConeGeometry(0.1, 0.4, 32);
		cone.translate(0, 1.2, 0);
		this.coneGeometry = BufferGeometryUtils.mergeVertices(cone);
		var cylinder = new CylinderGeometry(0.05, 0.05, 1, 32);
		cylinder.translate(0, 0.5, 0);

		this.cylinderGeometry = BufferGeometryUtils.mergeVertices(cylinder);
		this.groupGeometry = BufferGeometryUtils.mergeBufferGeometries([this.coneGeometry, this.cylinderGeometry]);
		this.group = new Mesh(this.groupGeometry, PlaneModelMaterial.control);
		this.group.position.set(center.x, center.y, center.z);
		this.group.userData.SectionBox = true;
		this.group.userData.type = type;
		this.group.userData.origin = PlaneModelMaterial.control;
		this.group.userData.hover = PlaneModelMaterial.hoverControl;
		this.group.userData.canTransForm = true;
		scene.add(this.group);
		this.group.userData.setTransFormControls = (transForm) => {
			this.switchTransFormControls(transForm);
		};
	}
	rotateX(left) {
		var angle = left ? Math.PI / 2 : -Math.PI / 2;
		this.group.rotateX(angle);
	}
	rotateY(front) {
		var angle = front ? Math.PI / 2 : -Math.PI / 2;
		this.group.rotateY(angle);
	}
	rotateZ(top) {
		var angle = top ? Math.PI / 2 : -Math.PI / 2;
		this.group.rotateZ(angle);
	}
	visibility(visible) {
		this.group.visible = visible;
	}
	update(center) {
		this.group.position.set(center.x, center.y, center.z);
	}
	switchTransFormControls(transForm) {
		switch (this.type) {
			case 1: //left
				transForm.showX = false;
				transForm.showY = false;
				transForm.showZ = true;
				break;
			case 2: //right
				transForm.showX = false;
				transForm.showY = false;
				transForm.showZ = true;
				break;
			case 3: //front
				transForm.showX = true;
				transForm.showY = false;
				transForm.showZ = false;
				break;
			case 4: //back
				transForm.showX = true;
				transForm.showY = false;
				transForm.showZ = false;
				break;
			case 5: //top
				transForm.showX = false;
				transForm.showY = true;
				transForm.showZ = false;
				break;
			case 6: //bottom
				transForm.showX = false;
				transForm.showY = true;
				transForm.showZ = false;
				break;
			default:
				break;
		}
	}
}
