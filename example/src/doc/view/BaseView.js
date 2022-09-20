import {
	AmbientLight,
	AxesHelper,
	DirectionalLight,
	GridHelper,
	OrthographicCamera,
	WebGLRenderer,
	Raycaster,
	Vector2,
	Mesh,
	Vector3,
	Box3,
	SphereGeometry,
	BufferGeometry,
	Quaternion,
	Matrix4,
} from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { LightColor, CubeControlMaterial } from "../material";
import { CubeControls } from "./CubeControl";

export class BaseView {
	constructor(scene, container, canvas, alpha = true) {
		this.scene = scene;
		this.container = container;
		this.canvas = canvas;
		this.alpha = alpha;
		this.width = this.container.clientWidth;
		this.height = this.container.clientHeight;

		this.initCamera();
		this.initLight();
		this.initRenderer();
		this.initGrid();
		this.initOrbitControls();
		this.initResize(container, canvas);
		this.initPivot();
		this.initRayCaster();
	}
	initCamera() {
		this.camera = new OrthographicCamera(
			this.width / -50,
			this.width / 50,
			this.height / 50,
			this.height / -50,
			-1.0e6,
			1.0e6
		);
		this.camera.position.z = 1000;
		this.camera.position.y = 1000;
		this.camera.position.x = 1000;
		this.camera.lookAt(this.scene.position);
	}
	initLight() {
		this.ambientLight = new AmbientLight(LightColor.light, 2);
		this.scene.add(this.ambientLight);

		this.directionalLight = new DirectionalLight(LightColor.light, 2);
		this.directionalLight.position.set(0, 10, 0);
		this.directionalLight.target.position.set(-5, 0, 0);
		this.scene.add(this.directionalLight);
		this.scene.add(this.directionalLight.target);
	}
	initRenderer() {
		this.renderer = new WebGLRenderer({ canvas: this.canvas, alpha: this.alpha, antialias: true });
		this.renderer.setSize(this.width, this.height);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.domElement.setAttribute("tabindex", 1);
		this.renderer.localClippingEnabled = true;
	}
	initGrid() {
		this.grid = new GridHelper(100, 10);
		this.scene.add(this.grid);
		this.axes = new AxesHelper(3);
		this.axes.material.depthTest = false;
		this.axes.renderOrder = 1;
		this.scene.add(this.axes);
	}
	initOrbitControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = false;
		this.controls.target.set(-0, 0, 0);
		this.controls.mouseButtons.MIDDLE = 2;
		this.controls.mouseButtons.RIGHT = -1;
		this.controls.listenToKeyEvents(this.renderer.domElement);
	}
	initResize(container, canvas) {
		var _this = this;
		window.addEventListener(
			"resize",
			function (e) {
				_this.container = container;
				_this.canvas = canvas;
				_this.width = _this.container.clientWidth;
				_this.height = _this.container.clientHeight;
				_this.camera.left = _this.width / -50;
				_this.camera.right = _this.width / 50;
				_this.camera.updateProjectionMatrix();
				_this.renderer.setSize(_this.width, _this.height, true);
			},
			false
		);

		_this.renderer.domElement.addEventListener("onwheel", function () {});
	}
	initPivot() {
		const geometry = new SphereGeometry(0.2, 32, 16);
		this.pivot = new Mesh(geometry, CubeControlMaterial.hoverCube);
		this.pivot.userData.pivot = true;
		this.scene.add(this.pivot);
		this.pivot.visible = false;
		this.sectionBox = {
			type: -1,
			center: null,
			max: null,
			min: null,
			isSectionBox: false,
		};
	}
	initRayCaster() {
		this.rayCaster = new Raycaster();
		this.rayCaster.firstHitOnly = true;
		this.mouse = new Vector2();
		this.preselectModel = { id: -1 };
		this.expressID = -1;
		this.multiExpressID = [];
	}
	initCubeControls(container, canvas) {
		this.cubeControl = new CubeControls(container, canvas);
		this.cubeControl.onPick(this.camera);
	}

	animate() {
		this.camera.updateProjectionMatrix();
		this.camera.lookAt(this.scene.position);
		this.controls.update();
		TWEEN.update();
		this.renderer.render(this.scene, this.camera);
		if (this.cubeControl) {
			this.cubeControl.animate(this.camera, this.controls);
		}
	}
}
