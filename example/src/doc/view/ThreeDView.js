import { BaseView } from "./BaseView";
import kd from "../utils/keydrown";
export class ThreeDView extends BaseView {
	constructor(scene, container, canvas, alpha) {
		super(scene, container, canvas, alpha);
		this.initKeyboard();
	}
	multiSelect = false;
	shiftSelect = false;
	allSelect = false;
	initKeyboard() {
		var _this = this;
		kd.CTRL.down(function () {
			_this.multiSelect = true;
			_this.controls.mouseButtons.LEFT = -1;
		});
		kd.CTRL.up(function () {
			_this.multiSelect = false;
			_this.controls.mouseButtons.LEFT = 0;
		});
		kd.SHIFT.down(function () {
			_this.shiftSelect = true;
		});

		kd.SHIFT.up(function () {
			_this.shiftSelect = false;
		});
		kd.A.down(function () {
			_this.allSelect = true;
		});

		kd.A.up(function () {
			_this.allSelect = false;
		});
		kd.run(function () {
			kd.tick();
		});
	}
	visibilityMR(e) {
		const isExpressID = this.expressID !== -1;
		return {
			top: e.clientY,
			left: e.clientX,
			isolated: isExpressID,
			property: isExpressID,
			selectAll: isExpressID,
			selectFilter: !isExpressID,
			showAll: !isExpressID,
		};
	}
	refreshJob() {
		this.expressID = -1;
		this.multiExpressID = [];
		this.preselectModel.id = -1;
	}
}
