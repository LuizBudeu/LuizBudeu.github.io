import Rect from "./ui/rect.js";
import Signal from "./signal.js";
import Settings from "./settings.js";
import SavedGate from "./gui/savedGate.js";

function centerTextInRect(ctx, rect, text, fontSize) {
    // Calculate the center of the rectangle
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;

    ctx.font = `${fontSize}px Arial`; // Set the font for measurement

    // Measure the text width and height
    const textWidth = ctx.measureText(text).width;
    const textHeight = fontSize; // Assuming constant height for simplicity

    // Calculate the position for the text to be centered
    const textX = centerX - textWidth / 2;
    const textY = centerY + textHeight / 4; // Adjust for vertical centering

    // Return the calculated position
    return { x: textX, y: textY };
}

class Toolbox {
    constructor(canvas, ctx) {
        /** @type {CanvasRenderingContext2D} */
        this.canvas = canvas;
        /** @type {HTMLCanvasElement} */
        this.ctx = ctx;

        this.savedGatesFromFile = [];
        this.savedGates = [];
    }

    initSavedGates() {
        fetch("./engine/saveData/savedGates.json")
            .then((response) => response.json())
            .then((json) => {
                this.savedGatesFromFile = json;
            })
            .catch(() => {
                this.savedGatesFromFile = [
                    {
                        name: "NAND",
                        path: "/components/logic/NAND.js",
                    },
                ];
            })
            .finally(() => {
                this.savedGatesFromFile.forEach((gateObj, index) => {
                    const savedGate = new SavedGate(this.ctx, this, gateObj.name, gateObj.path);
                    savedGate.start();

                    // Set dimensions for the saved gate
                    const height = 40;
                    const width = 80;
                    savedGate.rect.size(width, height);

                    // Set margin and spacing between saved gates
                    const margin = {
                        x: 10,
                        y: 10,
                    };
                    const spacing = width + margin.x;

                    // Calculate position for the saved gate
                    const toolboxPos = this.rect.at();
                    const gateX = toolboxPos.x + margin.x + index * spacing;
                    const gateY = toolboxPos.y + margin.y;

                    savedGate.rect.at(gateX, gateY);
                    savedGate.rect.innerText.centerInRect(savedGate.rect);

                    this.savedGates.push(savedGate);

                    Signal.sceneInstance.place(savedGate, 0);
                });
            });
    }

    start() {
        const height = 60;
        this.rect = new Rect(this.ctx)
            .at(0, this.canvas.height - height)
            .size(this.canvas.width, height)
            .color("#0C0C0C");

        this.initSavedGates();
    }

    update() {}

    draw() {
        this.rect.draw();
    }
}

export default Toolbox;
