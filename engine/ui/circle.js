import gameObject from "../baseScript.js";

class Circle extends gameObject {
    constructor(ctx) {
        super(ctx);

        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.x = 100;
        this.y = 100;
        this.circleRadius = 50;
        this.circleColor = "#000"; // Default color is black
        this.lineWidth = 1; // Default line width is 1

        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
    }

    at(x = null, y = null) {
        if (x === null && y === null) return { x: this.x, y: this.y }; // Return the current position
        if (x !== null) this.x = x;
        if (y !== null) this.y = y;
        return this;
    }

    radius(radius = null) {
        if (radius === null) return this.circleRadius; // Return the current radius
        this.circleRadius = radius;
        return this;
    }

    color(color = null) {
        if (color !== null) this.circleColor = color;
        return this;
    }

    debug(debugging = true) {
        this.debugging = debugging;

        if (this.debugging) {
            // Event listeners for dragging
            this.ctx.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
            this.ctx.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
            this.ctx.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
        } else {
            // Remove event listeners
            this.ctx.canvas.removeEventListener("mousedown", this.handleMouseDown.bind(this));
            this.ctx.canvas.removeEventListener("mousemove", this.handleMouseMove.bind(this));
            this.ctx.canvas.removeEventListener("mouseup", this.handleMouseUp.bind(this));
        }

        return this;
    }

    draw() {
        // Draw the circle
        this.ctx.fillStyle = this.circleColor;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.circleRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();

        if (this.debugging) {
            // Draw the center point
            this.ctx.fillStyle = "#ff0000";
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();

            // Draw the debug text

            const debugText = `(${this.x}, ${this.y}) - ${this.circleRadius}`;
            const textWidth = this.ctx.measureText(debugText).width;

            this.ctx.fillStyle = "#fff";
            this.ctx.font = "11px Arial";
            this.ctx.fillText(debugText, this.x - textWidth / 2, this.y - 5 - this.circleRadius);
        }

        return this;
    }

    handleMouseDown(event) {
        const mouseX = event.clientX - this.ctx.canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - this.ctx.canvas.getBoundingClientRect().top;

        // Check if the mouse is inside the circle
        const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
        if (distance <= this.circleRadius) {
            this.isDragging = true;
            this.dragStartX = mouseX - this.x;
            this.dragStartY = mouseY - this.y;
        }
    }

    handleMouseMove(event) {
        if (this.isDragging) {
            const mouseX = event.clientX - this.ctx.canvas.getBoundingClientRect().left;
            const mouseY = event.clientY - this.ctx.canvas.getBoundingClientRect().top;

            this.x = mouseX - this.dragStartX;
            this.y = mouseY - this.dragStartY;

            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.draw();
        }
    }

    handleMouseUp() {
        this.isDragging = false;
    }
}

export default Circle;
