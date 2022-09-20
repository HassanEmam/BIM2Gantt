export function castElement(event, view, filter) {
	const bounds = view.renderer.domElement.getBoundingClientRect();
	const x1 = event.clientX - bounds.left;
	const y1 = event.clientY - bounds.top;
	const x2 = bounds.right - bounds.left;
	view.mouse.x = (x1 / x2) * 2 - 1;
	const y2 = bounds.bottom - bounds.top;
	view.mouse.y = -(y1 / y2) * 2 + 1;
	view.rayCaster.setFromCamera(view.mouse, view.camera);
	return view.rayCaster.intersectObjects(filter);
}
export function castMultiElement(region, view, filter) {
	const bounds = view.renderer.domElement.getBoundingClientRect();
	let founds = [];
	var mouse = { x: 0, y: 0 };
	for (let i = 0; i <= 20; i++) {
		const x1 = region.left + i * (region.width * 0.05) - bounds.left;
		const x2 = bounds.right - bounds.left;
		mouse.x = (x1 / x2) * 2 - 1;
		for (let j = 0; j <= 20; j++) {
			const y1 = region.top + j * (region.height * 0.05) - bounds.top;
			const y2 = bounds.bottom - bounds.top;
			mouse.y = -(y1 / y2) * 2 + 1;
			view.rayCaster.setFromCamera(mouse, view.camera);
			founds = founds.concat(view.rayCaster.intersectObjects(filter));
		}
	}
	var result = {};
	founds.forEach((found) => {
		if (!result[found.object.modelID]) {
			result[found.object.modelID] = {
				object: found.object,
				faceIndex: [],
			};
		}
		var index = result[found.object.modelID].faceIndex.find((f) => f === found.faceIndex);
		if (!index) {
			result[found.object.modelID].faceIndex.push(found.faceIndex);
		}
	});
	return result;
}
