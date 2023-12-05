import Text from "./text.js";
import gameObject from "../baseScript.js";

class Rect extends gameObject {
    constructor(ctx) {
        super(ctx);
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 100;
        this.rectColor = "#000"; // Default color is black
        this.lineWidth = 1; // Default line width is 1
        this.lineColor = "#000"; // Default line color is black
        this.debugging = false;

        this.innerText = new Text(this.ctx);
        this.isDragging = false;
        this.isResizing = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.cornerHitBox = 10;
    }

    at(x = null, y = null) {
        if (x === null && y === null) return { x: this.x, y: this.y }; // Return the current position if no arguments are passed
        if (x) this.x = x;
        if (y) this.y = y;
        return this;
    }

    center(x = null, y = null) {
        if (x === null && y === null) return { x: this.x + this.width / 2, y: this.y + this.height / 2 }; // Return the current center if no arguments are passed
        if (x) this.x = x - this.width / 2;
        if (y) this.y = y - this.height / 2;
        return this;
    }

    size(width = null, height = null, lineWidth = null) {
        if (width) this.width = width;
        if (height) this.height = height;
        if (lineWidth) this.lineWidth = lineWidth;
        return this;
    }

    color(rectColor = null, lineColor = null) {
        if (rectColor) this.rectColor = rectColor;
        if (lineColor) this.lineColor = lineColor;
        return this;
    }

    debug(debugging = true) {
        this.debugging = debugging;

        if (this.debugging) {
            // Event listeners for dragging
            this.ctx.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
            this.ctx.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
            this.ctx.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));

            this.debugTextContent = `(${this.x}, ${this.y}) - ${this.width}x${this.height}`;
            const textWidth = this.ctx.measureText(this.debugTextContent).width;

            this.debugText = new Text(this.ctx)
                .at(this.x + this.width / 2 - textWidth / 2, this.y - 5)
                .content(this.debugTextContent)
                .style("Arial", 11, "#fff");
        } else {
            // Remove event listeners
            this.ctx.canvas.removeEventListener("mousedown", this.handleMouseDown.bind(this));
            this.ctx.canvas.removeEventListener("mousemove", this.handleMouseMove.bind(this));
            this.ctx.canvas.removeEventListener("mouseup", this.handleMouseUp.bind(this));
        }

        return this;
    }

    draw() {
        // Draw the rectangle
        this.ctx.fillStyle = this.rectColor;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw the inner text
        const textWidth = this.ctx.measureText(this.innerText).width; // TODO fix this
        this.innerText.draw();

        if (this.debugging) {
            this.debugText.draw();

            // Draw little red dots at each corner
            const dotSize = this.cornerHitBox / 3;
            this.ctx.fillStyle = "red";
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, dotSize, 0, 2 * Math.PI);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(this.x + this.width, this.y, dotSize, 0, 2 * Math.PI);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y + this.height, dotSize, 0, 2 * Math.PI);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(this.x + this.width, this.y + this.height, dotSize, 0, 2 * Math.PI);
            this.ctx.fill();
        }

        return this;
    }

    handleMouseDown(event) {
        const mouseX = event.clientX - this.ctx.canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - this.ctx.canvas.getBoundingClientRect().top;

        // Check if the mouse is inside the rectangle
        if (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height) {
            // Check if the mouse is near one of the corners for resizing
            const resizeMargin = this.cornerHitBox; // Adjust this value for sensitivity

            if (mouseX < this.x + resizeMargin && mouseY < this.y + resizeMargin) {
                // Top-left corner
                this.isResizing = true;
                this.resizeDirection = "top-left";
            } else if (mouseX > this.x + this.width - resizeMargin && mouseY < this.y + resizeMargin) {
                // Top-right corner
                this.isResizing = true;
                this.resizeDirection = "top-right";
            } else if (mouseX < this.x + resizeMargin && mouseY > this.y + this.height - resizeMargin) {
                // Bottom-left corner
                this.isResizing = true;
                this.resizeDirection = "bottom-left";
            } else if (mouseX > this.x + this.width - resizeMargin && mouseY > this.y + this.height - resizeMargin) {
                // Bottom-right corner
                this.isResizing = true;
                this.resizeDirection = "bottom-right";
            } else {
                // Otherwise, initiate dragging
                this.isDragging = true;
                this.dragStartX = mouseX - this.x;
                this.dragStartY = mouseY - this.y;
            }
        }
    }

    handleMouseMove(event) {
        const mouseX = event.clientX - this.ctx.canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - this.ctx.canvas.getBoundingClientRect().top;

        if (this.isResizing) {
            this.resize(mouseX, mouseY);
        } else if (this.isDragging) {
            this.x = mouseX - this.dragStartX;
            this.y = mouseY - this.dragStartY;
        }
    }

    handleMouseUp() {
        this.isDragging = false;
        this.isResizing = false;
    }

    resize(mouseX, mouseY) {
        switch (this.resizeDirection) {
            case "top-left":
                this.width += this.x - mouseX;
                this.height += this.y - mouseY;
                this.x = mouseX;
                this.y = mouseY;
                break;
            case "top-right":
                this.width = mouseX - this.x;
                this.height += this.y - mouseY;
                this.y = mouseY;
                break;
            case "bottom-left":
                this.width += this.x - mouseX;
                this.height = mouseY - this.y;
                this.x = mouseX;
                break;
            case "bottom-right":
                this.width = mouseX - this.x;
                this.height = mouseY - this.y;
                break;
            default:
                break;
        }
    }
}

export default Rect;
