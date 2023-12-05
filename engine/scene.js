import Settings from "./settings.js";
import Rect from "./ui/rect.js";
import Circle from "./ui/circle.js";
import Input from "./components/input.js";
import Output from "./components/output.js";
import Gate from "./components/gate.js";
import Wire from "./components/wire.js";
import OR from "./components/logic/OR.js";
import Text from "./ui/text.js";
import Signal from "./signal.js";
import TwoWayMap from "./utils/twoWayMap.js";
import Mouse from "./input/mouse.js";

class Scene {
    constructor(canvas, ctx) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;

        this.layerGameObjects = {
            0: [], // Background
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
            10: [],
        };

        this.gameObjectId = 0;
        this.gameObjectsMap = new TwoWayMap();

        Signal.setSceneInstance(this);
    }

    start() {
        this.setupBackground();

        // Inputs
        this.input1 = new Input(this.ctx, true);
        this.input1.circle.at(50, 313).radius(Settings.IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR);
        this.place(this.input1);

        this.input2 = new Input(this.ctx, true);
        this.input2.circle.at(50, 576).radius(Settings.IO_CIRCLE_RADIUS).color(Settings.COMPONENT_IO_OFF_COLOR);
        this.place(this.input2);

        // Output
        this.output = new Output(this.ctx);
        this.output.circle
            .at(this.canvas.width - 50, this.canvas.height / 2 - Settings.IO_CIRCLE_RADIUS)
            .radius(Settings.IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);

        this.place(this.output);

        // Gate
        this.gate = new Gate(this.ctx, OR);
        this.place(this.gate);

        this.wiring = {};

        // Start all game objects
        for (let i = 0; i <= 10; i++) {
            this.layerGameObjects[i].forEach((gameObject) => {
                gameObject.start();
            });
        }
    }

    place(gameObject, layer = 1) {
        this.layerGameObjects[layer].push(gameObject);
        this.addToGameObjectMap(gameObject);
    }

    remove(gameObject, layer = 1) {
        this.layerGameObjects[layer] = this.layerGameObjects[layer].filter((obj) => obj !== gameObject);
        this.removeFromGameObjectMap(gameObject);
    }

    addToGameObjectMap(gameObject) {
        this.gameObjectsMap.set(this.gameObjectId, gameObject);
        this.gameObjectId++;
    }

    removeFromGameObjectMap(gameObject) {
        this.gameObjectsMap.revDelete(gameObject);
    }

    getGameObjectById(id) {
        return this.gameObjectsMap.get(id);
    }

    getIdByGameObject(gameObject) {
        return this.gameObjectsMap.revGet(gameObject);
    }

    update(deltaTime) {
        for (let i = 0; i <= 10; i++) {
            this.layerGameObjects[i].forEach((gameObject) => {
                gameObject.update(deltaTime);
            });
        }
    }

    draw() {
        this.ctx.strokeStyle = "#000";
        for (let i = 0; i <= 10; i++) {
            this.layerGameObjects[i].forEach((gameObject) => {
                gameObject.draw();
            });
        }
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    setupBackground() {
        // Canvas
        const canvasRect = new Rect(this.ctx).at(0, 0).size(this.canvas.width, this.canvas.height).color(Settings.CANVAS_BACKGROUND_COLOR);
        this.place(canvasRect, 0);

        // Toolbox
        const toolboxHeight = 60;
        const toolboxRect = new Rect(this.ctx)
            .at(0, this.canvas.height - toolboxHeight)
            .size(this.canvas.width, toolboxHeight)
            .color("#0C0C0C");
        this.place(toolboxRect, 0);

        // Binding box
        const bindingBoxRect = new Rect(this.ctx)
            .at(50, 80)
            .size(this.canvas.width - 100, this.canvas.height - 170)
            .color("#3D3D3D");
        this.place(bindingBoxRect, 0);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        Settings.CANVAS_WIDTH = this.canvas.width;
        Settings.CANVAS_HEIGHT = this.canvas.height;
    }

    addWiring(io1, io2) {
        const io1Id = this.getIdByGameObject(io1);
        const io2Id = this.getIdByGameObject(io2);

        const wire = new Wire(this.ctx).color(Settings.WIRE_COLOR);
        wire.connect(io1.circle.x, io1.circle.y, io2.circle.x, io2.circle.y);

        this.place(wire);

        this.wiring[`${io1Id}_${io2Id}`] = wire;
    }
}

export default Scene;
