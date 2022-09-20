import {
	Chart,
	ArcElement,
	LineElement,
	BarElement,
	PointElement,
	BarController,
	BubbleController,
	DoughnutController,
	LineController,
	PieController,
	PolarAreaController,
	RadarController,
	ScatterController,
	CategoryScale,
	LinearScale,
	LogarithmicScale,
	RadialLinearScale,
	TimeScale,
	TimeSeriesScale,
	Decimation,
	Filler,
	Legend,
	Title,
	Tooltip,
	SubTitle,
} from "chart.js";

Chart.register(
	ArcElement,
	LineElement,
	BarElement,
	PointElement,
	BarController,
	BubbleController,
	DoughnutController,
	LineController,
	PieController,
	PolarAreaController,
	RadarController,
	ScatterController,
	CategoryScale,
	LinearScale,
	LogarithmicScale,
	RadialLinearScale,
	TimeScale,
	TimeSeriesScale,
	Decimation,
	Filler,
	Legend,
	Title,
	Tooltip,
	SubTitle
);
export class ChartModel {
	constructor(categories) {
		this.data = this.initChartData(categories);
	}
	initChartData(categories) {
		var chartData = {};
		const keys = Object.keys(categories);
		for (let i = 0; i < keys.length; i++) {
			const typeKeys = Object.keys(categories[keys[i]].type);

			if (typeKeys.length > 0) {
				if (!chartData[keys[i]]) {
					chartData[keys[i]] = categories[keys[i]];
				}
			}
		}
		return chartData;
	}
	generateColors(count) {
		var background = [];
		var borders = [];
		for (var i = 0; i < count; i++) {
			var r = Math.round(Math.random() * 255);
			var g = Math.round(Math.random() * 255);
			var b = Math.round(Math.random() * 255);
			background.push("rgba(" + r + ", " + g + ", " + b + ", 0.2)");
			borders.push("rgba(" + r + ", " + g + ", " + b + ", 0.2)");
		}
		return { background: background, borders: borders };
	}
	generateChartData(field) {
		var dataChart = [];
		var _this = this;
		var keys = Object.keys(_this.data);
		if (field === "Category") {
			keys.forEach((key) => {
				dataChart.push({
					label: key,
					ids: _this.data[key].ids,
				});
			});
		} else {
			keys.forEach((key) => {
				var typeKeys = Object.keys(_this.data[key].type);
				typeKeys.forEach((type) => {
					dataChart.push({
						label: type,
						ids: _this.data[key].type[type],
					});
				});
			});
		}
		return dataChart;
	}
	getChartOption(type, onClick) {
		switch (type) {
			case "bar":
				return {
					indexAxis: "x",
					plugins: {
						legend: {
							display: false,
						},
					},
					scales: {
						x: {
							display: true,
							title: {
								display: true,
							},
						},
						y: {
							display: true,
							title: {
								display: true,
							},
						},
					},
					onClick: onClick,
				};

			case "doughnut":
				return {
					plugins: {
						legend: {
							display: true,
							position: "top",
						},
					},
					onClick: onClick,
				};
			case "pie":
				return {
					plugins: {
						legend: {
							display: true,
							position: "top",
						},
					},
					onClick: onClick,
				};
			case "polarArea":
				return {
					plugins: {
						legend: {
							display: true,
							position: "top",
						},
					},
					onClick: onClick,
				};
			default:
				return {
					plugins: {
						legend: {
							display: false,
						},
					},
					scales: {
						x: {
							display: true,
							title: {
								display: true,
							},
						},
						y: {
							display: true,
							title: {
								display: true,
							},
						},
					},
					onClick: onClick,
				};
		}
	}
	drawChart(field, type, scene, subset, ifc, ifcModel) {
		var _this = this;
		var dataChart = _this.generateChartData(field);
		if (dataChart.length === 0) return;
		var content = document.getElementById("contentChart");
		content.innerHTML = "";
		var canvas = document.createElement("canvas");
		content.appendChild(canvas);
		var colors = _this.generateColors(dataChart.length);
		var onClick = function (evt) {
			if (myChart) {
				const points = myChart.getElementsAtEventForMode(evt, "nearest", { intersect: true }, true);
				if (points.length) {
					const firstPoint = points[0];
					const label = myChart.data.labels[firstPoint.index];
					var chart = dataChart.find((chart) => chart.label === label);
					if (chart) {
						subset = ifc.createSubset({
							modelID: ifcModel.modelID,
							scene: scene,
							ids: chart.ids,
							// material: cubeControlMaterial.ifcMaterial,
							removePrevious: true,
							customID: -1,
						});
						subset.userData.IFCModel = true;
						ifcModel.visible = false;
					}
				}
			}
		};
		const data = {
			labels: dataChart.map((d) => d.label),
			datasets: [
				{
					data: dataChart.map((d) => d.ids.length),
					backgroundColor: colors.background,
					borderColor: colors.borders,
					borderWidth: 1,
				},
			],
		};
		var context = canvas.getContext("2d");

		var myChart = new Chart(context, {
			type: type,
			data,
			options: _this.getChartOption(type, onClick),
		});
	}
}
