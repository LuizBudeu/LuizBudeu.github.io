import Rect from "../ui/rect.js";
import Settings from "../settings.js";
import Input from "./input.js";
import Output from "./output.js";
import Mouse from "../input/mouse.js";
import WiringManager from "../managers/wiringManager.js";
import Signal from "../signal.js";

class Gate {
    constructor(ctx, logic) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.logic = logic;
    }

    start() {
        this.rect = new Rect(this.ctx)
            .at(Settings.CANVAS_WIDTH / 2 - 50, Settings.CANVAS_HEIGHT / 2 - 50)
            .size(100, 100)
            .color("#7a130d");

        this.rect.innerText.style("Arial", 20, "#fff").content(this.logic.name);
        this.rect.innerText.centerInRect(this.rect);

        // Position the inputs and output
        const rectPos = this.rect.at();
        this.inputs = [new Input(this.ctx), new Input(this.ctx)]; // TODO add possibility of multiple inputs
        this.inputs[0].circle
            .at(rectPos.x, rectPos.y + this.rect.width / 3)
            .radius(Settings.COMPONENT_IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);
        this.inputs[1].circle
            .at(rectPos.x, rectPos.y + (this.rect.width * 2) / 3)
            .radius(Settings.COMPONENT_IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);

        this.output = new Output(this.ctx);
        this.output.circle
            .at(rectPos.x + this.rect.width, rectPos.y + this.rect.height / 2)
            .radius(Settings.COMPONENT_IO_CIRCLE_RADIUS)
            .color(Settings.COMPONENT_IO_OFF_COLOR);

        // Place the inputs and output in the scene
        Signal.sceneInstance.place(this.inputs[0]);
        Signal.sceneInstance.place(this.inputs[1]);
        Signal.sceneInstance.place(this.output);

        Mouse.addLeftClickDraggingEvent(this.handleDragging.bind(this), this.rect);
    }

    update(deltaTime) {
        this.compute();
    }

    draw() {
        this.rect.draw();
        this.inputs.forEach((input) => {
            input.circle.draw();
        });
        this.output.circle.draw();
    }

    compute() {
        const result = this.logic(this.inputs[0].value(), this.inputs[1].value());
        this.output.value(result);
    }

    handleDragging({ deltaX, deltaY }) {
        // Move the gate
        this.rect.x += deltaX;
        this.rect.y += deltaY;

        // Move the inner text
        this.centerInnerText();

        // Move the inputs and output
        const rectPos = this.rect.at();
        this.inputs[0].circle.at(rectPos.x, rectPos.y + this.rect.width / 3);
        this.inputs[1].circle.at(rectPos.x, rectPos.y + (this.rect.width * 2) / 3);
        this.output.circle.at(rectPos.x + this.rect.width, rectPos.y + this.rect.height / 2);

        // Move the wires
        WiringManager.moveWiring(this.inputs[0]);
        WiringManager.moveWiring(this.inputs[1]);
        WiringManager.moveWiring(this.output);
    }

    centerInnerText() {
        const textWidth = this.ctx.measureText(this.rect.innerText.textContent).width;
        const textHeight = this.rect.innerText.fontSize;
        this.rect.innerText.at(this.rect.x + this.rect.width / 2 - textWidth / 2, this.rect.y + this.rect.height / 2 + textHeight / 2);
    }
}

export default Gate;
