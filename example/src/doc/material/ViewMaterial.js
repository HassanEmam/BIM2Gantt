import { MeshLambertMaterial, MeshBasicMaterial, DoubleSide, MeshPhongMaterial } from "three";
export const ViewMaterial = {
	selectIfcModel: (transparent, opacity, color) => {
		return new MeshLambertMaterial({
			transparent: transparent,
			opacity: opacity,
			color: color,
			side: DoubleSide,
			depthWrite: true,
			depthTest: true,
		});
	},
	highlightIfcModel: (transparent, opacity, color) => {
		return new MeshLambertMaterial({
			transparent: transparent,
			opacity: opacity,
			color: color,
			side: DoubleSide,
			depthWrite: true,
			depthTest: true,
		});
	},
	highlightSectionBox: (transparent, opacity, color) => {
		return new MeshLambertMaterial({
			transparent: transparent,
			opacity: opacity,
			color: color,
			side: DoubleSide,
			depthWrite: true,
			depthTest: true,
		});
	},
	changeMaterial: (option, material) => {
		if (option.transparent) material.transparent = option.transparent;
		if (option.opacity) material.opacity = option.opacity;
		if (option.color) material.color = option.color;
	},
};
