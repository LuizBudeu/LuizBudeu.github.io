import Circle from "../ui/circle.js";
import Settings from "../settings.js";
import Mouse from "../input/mouse.js";
import Signal from "../signal.js";
import SelectionManager from "../managers/selectionManager.js";
import gameObject from "../baseScript.js";

class IO extends gameObject {
    constructor(ctx) {
        super(ctx);

        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.circle = new Circle(this.ctx);
        this._value = false;
        this.isSelected = false;

        this.IOConnections = [];

        // Selection circle
        this.selectionCircle = new Circle(this.ctx).color("#00F");

        // Event listener for selecting the IO
        Mouse.addRightClickDownEvent(this.handleRightClick.bind(this));
    }

    start() {}

    update(deltaTime) {
        this.propagate();
    }

    draw() {
        this.circle.draw();
    }

    value(value = null) {
        if (value === null) return this._value;
        this._value = value;
        if (value) {
            this.circle.color(Settings.COMPONENT_IO_ON_COLOR);
        } else {
            this.circle.color(Settings.COMPONENT_IO_OFF_COLOR);
        }
    }

    connect(io) {
        this.IOConnections.push(io);
        io.IOConnections.push(this);
    }

    disconnect(io) {
        this.IOConnections.splice(this.IOConnections.indexOf(io), 1);
        io.IOConnections.splice(io.IOConnections.indexOf(this), 1);
    }

    propagate() {
        this.IOConnections.forEach((io) => {
            io.value(this.value());
        });
    }

    handleRightClick({ x, y, button }) {
        // Check if the right-click is within the circle
        const distance = Math.sqrt((x - this.circle.x) ** 2 + (y - this.circle.y) ** 2);
        if (distance <= this.circle.radius()) {
            this.isSelected = !this.isSelected; // Toggle the selection state

            if (this.isSelected) {
                SelectionManager.selectIO(this);
            } else {
                SelectionManager.deselectIO(this);
            }
        }
    }
}

export default IO;
