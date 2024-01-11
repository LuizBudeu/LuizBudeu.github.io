import Signal from "../signal.js";
import Wire from "../components/wire.js";
import Settings from "../settings.js";

class WiringKey {
    constructor(io1Id, io2Id) {
        this.io1Id = io1Id;
        this.io2Id = io2Id;
    }

    toString() {
        return `/${this.io1Id}_${this.io2Id}#`;
    }

    static fromString(str) {
        const io1Id = str.split("_")[0].split("/")[1];
        const io2Id = str.split("_")[1].split("#")[0];

        return new WiringKey(io1Id, io2Id);
    }
}

class WiringManager {
    static wiring = {};

    static addWiring(io1, io2) {
        const wire = new Wire(Signal.sceneInstance.ctx).color(Settings.WIRE_COLOR);
        wire.connect(io1.circle.x, io1.circle.y, io2.circle.x, io2.circle.y);

        Signal.sceneInstance.place(wire);

        const io1Id = Signal.sceneInstance.getIdByGameObject(io1);
        const io2Id = Signal.sceneInstance.getIdByGameObject(io2);

        const wiringKey = new WiringKey(io1Id, io2Id);

        WiringManager.wiring[wiringKey.toString()] = wire;
    }

    static removeWiring(io1, io2) {
        const io1Id = Signal.sceneInstance.getIdByGameObject(io1);
        const io2Id = Signal.sceneInstance.getIdByGameObject(io2);

        const wiringKey = new WiringKey(io1Id, io2Id);

        Signal.sceneInstance.remove(WiringManager.wiring[wiringKey.toString()]);
        delete WiringManager.wiring[wiringKey.toString()];
    }

    static moveWiring(io) {
        const ioId = Signal.sceneInstance.getIdByGameObject(io);

        if (!ioId) {
            throw new Error("IO not found");
        }

        Object.keys(WiringManager.wiring).forEach((key) => {
            const wiringKey = WiringKey.fromString(key);

            if (wiringKey.io1Id == ioId) {
                const wire = WiringManager.wiring[key];
                wire.connect(io.circle.x, io.circle.y, wire.endX, wire.endY);
            } else if (wiringKey.io2Id == ioId) {
                const wire = WiringManager.wiring[key];
                wire.connect(wire.startX, wire.startY, io.circle.x, io.circle.y);
            }
        });
    }

    static existsWiring(io1, io2 = null) {
        // if io2 is null, check if io1 is wired to anything
        if (io2 === null) {
            const io1Id = Signal.sceneInstance.getIdByGameObject(io1);

            Object.keys(WiringManager.wiring).forEach((key) => {
                const wiringKey = WiringKey.fromString(key);
                if (wiringKey.io1Id == io1Id || wiringKey.io2Id == io1Id) {
                    return true;
                }
            });

            return false;
        }

        const io1Id = Signal.sceneInstance.getIdByGameObject(io1);
        const io2Id = Signal.sceneInstance.getIdByGameObject(io2);

        const wiringKey1 = new WiringKey(io1Id, io2Id);
        const wiringKey2 = new WiringKey(io2Id, io1Id);

        return WiringManager.wiring[wiringKey1.toString()] || WiringManager.wiring[wiringKey2.toString()];
    }
}

export default WiringManager;
