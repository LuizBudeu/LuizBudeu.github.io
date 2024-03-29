import Signal from "../signal.js";
import Wire from "../components/wire.js";
import WiringManager from "./wiringManager.js";

class SelectionManager {
    static selectedIOs = [];

    static selectIO(io) {
        // Can only have two selected IOs at a time
        if (this.selectedIOs.length >= 2) {
            // Deselect the most recent one
            this.selectedIOs[1].isSelected = false;
            Signal.sceneInstance.remove(this.selectedIOs[1].selectionCircle, 0);
            this.selectedIOs.pop();
        }

        // // Handle selection of IO that is already wired: remove the wiring and select the other IO
        // if (WiringManager.existsWiring(io)) {
        //     const otherIO = io.IOConnections[0];
        //     WiringManager.removeWiring(io, otherIO);
        //     this.selectIO(otherIO);
        //     return;
        // }

        this.selectedIOs.push(io);
        io.isSelected = true;
        io.selectionCircle.at(io.circle.x, io.circle.y).radius(io.circle.radius() + 5);
        Signal.sceneInstance.place(io.selectionCircle, 0);

        if (this.selectedIOs.length === 2) {
            this.connectIOs();
        }
    }

    static deselectIO(io) {
        io.isSelected = false;
        SelectionManager.selectedIOs = SelectionManager.selectedIOs.filter((selectedIO) => selectedIO !== io);
        Signal.sceneInstance.remove(io.selectionCircle, 0);
    }

    static deselectAll() {
        this.selectedIOs.forEach((io) => {
            io.isSelected = false;
            Signal.sceneInstance.remove(io.selectionCircle, 0);
        });
        this.selectedIOs = [];
    }

    static connectIOs() {
        this.selectedIOs[0].connect(this.selectedIOs[1]);

        WiringManager.addWiring(this.selectedIOs[0], this.selectedIOs[1]);

        this.deselectAll();
    }
}

export default SelectionManager;
