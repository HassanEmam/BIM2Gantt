import { Plane, Vector3 } from "three";
import { Tween } from "@tweenjs/tween.js";
export class BuildingLevelModel {
	constructor(maxY, minY) {
		this.top = new Plane(new Vector3(0, -1, 0), maxY);
		this.bottom = new Plane(new Vector3(0, 1, 0), -minY);
		this.delta = 500;
	}
	update(maxY, minY) {
		var _this = this;
		const tween = new Tween({ pos: { maxY: _this.top.constant, minY: _this.bottom.constant } })
			.to({ pos: { maxY: maxY, minY: -minY } }, _this.delta)
			.onUpdate((coords) => {
				_this.top.constant = coords.pos.maxY;
				_this.bottom.constant = coords.pos.minY;
			});
		tween.start();
	}
}
