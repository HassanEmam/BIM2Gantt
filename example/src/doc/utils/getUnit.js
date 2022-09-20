import { IFCUNITASSIGNMENT } from "web-ifc";

const uomObj = {};

export async function getUnits(ifc, ifcModel) {
	const uom = await ifc.getAllItemsOfType(ifcModel.modelID, IFCUNITASSIGNMENT);
	const uomObject = await ifc.byId(ifcModel.modelID, uom[0]);
	for (let i = 0; i < uomObject.Units.length; i++) {
		const unitObject = await ifc.byId(ifcModel.modelID, uomObject.Units[i].value);

		let mType = null;

		if (unitObject.UnitType && unitObject.Name) {
			const pstrUoM = unitObject.Prefix ? unitObject.Prefix.value + " " : "";
			const strUoM = pstrUoM + unitObject.Name.value;
			switch (unitObject.UnitType.value) {
				case "MASSUNIT":
					mType = "mass";
					break;
				case "LENGTHUNIT":
					mType = "length";
					break;
				case "AREAUNIT":
					mType = "area";
					break;
				case "VOLUMEUNIT":
					mType = "volume";
					break;
				default:
					break;
			}
			if (mType) uomObj[mType] = strUoM;
		}
	}
	return uomObj;
}
