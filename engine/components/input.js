import Circle from "../ui/circle.js";
import Settings from "../settings.js";
import Signal from "../signal.js";
import Mouse from "../input/mouse.js";
import IO from "./io.js";

class Input extends IO {
    constructor(ctx, interactive = false) {
        super(ctx);

        if (interactive) {
            // Event listener for turning input on and off
            Mouse.addLeftClickDownEvent(this.handleLeftClick.bind(this));
        }
    }

    handleLeftClick({ x, y, button }) {
        // Check if the left-click is within the circle
        const distance = Math.sqrt((x - this.circle.x) ** 2 + (y - this.circle.y) ** 2);
        if (distance <= this.circle.radius()) {
            // Toggle the value
            this.value(!this.value());
        }
    }
}

export default Input;
