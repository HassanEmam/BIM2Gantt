import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import GeneralTab from "./GeneralTab";
import OtherTab from "./OtherTab";
import SelectionTab from "./SelectionTab";

const TabSetting = () => {
	return (
		<Tabs defaultActiveKey="general" id="justify-tab-example" className="mb-3" justify>
			<Tab eventKey="general" title="General">
				<GeneralTab />
			</Tab>
			<Tab eventKey="selection" title="Selection">
				<SelectionTab />
			</Tab>
			<Tab eventKey="other" title="Other">
				<OtherTab />
			</Tab>
		</Tabs>
	);
};

export default TabSetting;
