import gameObject from "../baseScript.js";
import Settings from "../settings.js";

class Wire extends gameObject {
    constructor(ctx) {
        super(ctx);

        this.ctx = ctx;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.lineColor = "#000"; // Default color is black
        this.lineWidth = Settings.WIRE_WIDTH; // Default line width is 2
        this.dotRadius = Settings.WIRE_DOT_RADIUS; // Default dot radius is 3
    }

    connect(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        return this;
    }

    color(color = null) {
        if (color) this.lineColor = color;
        return this;
    }

    draw() {
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.lineWidth = this.lineWidth;

        // Draw the wire
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(this.endX, this.endY);
        this.ctx.stroke();

        // Draw dots at each end
        this.drawDot(this.startX, this.startY);
        this.drawDot(this.endX, this.endY);

        return this;
    }

    drawDot(x, y) {
        this.ctx.fillStyle = this.lineColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.dotRadius, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}

export default Wire;
