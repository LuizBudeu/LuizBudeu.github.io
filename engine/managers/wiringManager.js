class WiringManager {
    constructor() {
        this.wires = [];
    }

    addWire(wire) {
        this.wires.push(wire);
    }

    removeWire(wire) {
        this.wires.splice(this.wires.indexOf(wire), 1);
    }

    update() {
        this.wires.forEach((wire) => {
            wire.update();
        });
    }

    draw() {
        this.wires.forEach((wire) => {
            wire.draw();
        });
    }
}

export default WiringManager;
