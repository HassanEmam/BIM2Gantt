import { ViewMaterial } from "../material";

export class SettingModel {
	constructor() {
		this.selectMaterial = ViewMaterial.selectIfcModel(true, 1, 0xff88ff);
		this.highlightMaterial = ViewMaterial.highlightIfcModel(true, 1, 0xff88ff);
		this.highlightSectionBoxMaterial = ViewMaterial.highlightSectionBox(true, 1, 0xff88ff);
	}
}
