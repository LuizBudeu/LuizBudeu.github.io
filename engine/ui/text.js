/**
 * Represents a text element to be drawn on a canvas.
 * @class
 */
class Text {
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    constructor(ctx) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;

        this.textContent = "";
        this.x = 100;
        this.y = 100;
        this.fontColor = "#000";
        this.fontSize = 20;
        this.fontFamily = "Arial";
        this.font = `${this.fontSize}px ${this.fontFamily}`;
    }

    /**
     * Set or get the position of the text.
     * @param {number} [x=null] - The x-coordinate.
     * @param {number} [y=null] - The y-coordinate.
     * @returns {Text} - If no arguments are passed, returns the current position. Otherwise, returns the Text instance.
     */
    at(x = null, y = null) {
        if (x === null && y === null) return { x: this.x, y: this.y }; // Return the current position if no arguments are passed
        if (x) this.x = x;
        if (y) this.y = y;
        return this;
    }

    /**
     * Center text horizontally and vertically inside rect.
     * @param {Rect} [rect] - The rect.
     */
    centerInRect(rect) {
        // Calculate the center of the rectangle
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;

        this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        const textWidth = this.ctx.measureText(this.textContent).width;
        const textHeight = this.fontSize;

        const textX = centerX - textWidth / 2;
        const textY = centerY + textHeight / 3;

        this.at(textX, textY);
    }

    /**
     * Set or get the content of the text.
     * @param {string} [textContent=null] - The text content.
     * @returns {Text} - The Text instance.
     */
    content(textContent = null) {
        if (textContent) this.textContent = textContent;
        return this;
    }

    /**
     * Set or get the style of the text.
     * @param {string} [fontFamily=null] - The font family.
     * @param {number} [fontSize=null] - The font size.
     * @param {string} [fontColor=null] - The font color.
     * @returns {Text} - The Text instance.
     */
    style(fontFamily = null, fontSize = null, fontColor = null) {
        if (fontFamily) this.fontFamily = fontFamily;
        if (fontSize) this.fontSize = fontSize;
        if (fontColor) this.fontColor = fontColor;
        this.font = `${this.fontSize}px ${this.fontFamily}`;
        return this;
    }

    /**
     * Set or get the color of the text.
     * @param {string} [color=null] - The text color.
     * @returns {Text} - The Text instance.
     */
    color(color = null) {
        if (color) this.fontColor = color;
        return this;
    }

    /**
     * Draw the text on the canvas.
     */
    draw() {
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.fontColor;
        this.ctx.fillText(this.textContent, this.x, this.y);
    }
}

export default Text;
