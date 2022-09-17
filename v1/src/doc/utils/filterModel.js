export function filterZoom(scene) {
	return scene.children.filter((e) => (e.userData.pivot || e.userData.SectionBox) && e.visible);
}
export function filterIfcModels(scene) {
	return scene.children.filter((e) => (e.constructor.name === "IFCModel" || e.userData.IFCModel) && e.visible);
}
export function filterSectionBox(scene) {
	return scene.children.filter((e) => e.userData.SectionBox && e.visible);
}
