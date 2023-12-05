import Settings from "./settings.js";
import Scene from "./scene.js";
import Mouse from "./input/mouse.js";
import Keyboard from "./input/keyboard.js";

class Core {
    constructor(canvas, ctx) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;

        Mouse.initialize(canvas);
        Keyboard.initialize();

        this.currentScene = null;

        this.previousTime = Date.now();
    }

    start() {
        Settings.CANVAS_WIDTH = this.canvas.width;
        Settings.CANVAS_HEIGHT = this.canvas.height;

        this.setupScene();

        this.gameLoop();
    }

    update(deltaTime) {
        this.currentScene.update(deltaTime);

        this.currentScene.draw();
    }

    gameLoop() {
        const updateBound = this.update.bind(this);

        const loop = () => {
            const currentTime = Date.now();
            const deltaTime = (currentTime - this.previousTime) / 1000;
            Settings.DELTA_TIME = deltaTime;

            updateBound(deltaTime);

            this.previousTime = currentTime;

            requestAnimationFrame(loop);
        };

        loop();
    }

    setupScene() {
        this.currentScene = new Scene(this.canvas, this.ctx);
        this.currentScene.setupCanvas();
        this.currentScene.start();
    }
}

export default Core;
