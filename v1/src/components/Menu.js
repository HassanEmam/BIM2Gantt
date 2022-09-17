import React from "react";
import OpenFile from "./OpenFile";
import Setting from "./Setting";
import ModelBrowser from "./Extension/ModelBrowser";
import BuildingStorey from "./Extension/BuildingStorey";
import Filter from "./Extension/Filter";

import VisualCluster from "./Extension/VisualCluster";
import VisualExplore from "./Extension/VisualExplore";
import DefaultSB from "./Extension/DefaultSB";
import ItemSB from "./Extension/ItemSB";
import HideSB from "./Extension/HideSB";
import VisualChart from "./Extension/VisualChart";
import Simulation from "./Extension/Simulation";

const Menu = (props) => {
	const { isLoad } = props;
	return (
		<div className="menu">
			<div className="d-flex justify-content-center">
				<div className="card card-menu">
					<OpenFile job={1} />
					<Setting job={2} />
				</div>
				{isLoad ? (
					<>
						{/* modelbrowser+buildingstorey */}
						<div className="card card-menu">
							<ModelBrowser job={3} />
							<BuildingStorey job={4} />
						</div>
						{/* visualization (visual cluster + visual explore) */}
						<div className="card card-menu">
							<VisualCluster job={5} />
							<VisualExplore job={6} />
						</div>
						{/* section box */}
						<div className="card card-menu">
							<DefaultSB job={7} />
							<ItemSB job={8} />
							<HideSB job={0} />
						</div>
						{/* { chart} */}
						<div className="card card-menu">
							<VisualChart job={9} />
							<Simulation job={10} />
						</div>
						{/* { Filter, search} */}
						<div className="card card-menu">
							<Filter job={11} />
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default Menu;
//1:open file
//2:setting
//3:modelBrowser
//4:BuildingStorey
//5:Visual Cluster
//6:Visual Explore
//7:DefaultSB
//8:ItemSB
//9:Visual Chart
//10:Simulation
//11:Filter
