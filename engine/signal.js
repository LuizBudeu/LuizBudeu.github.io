class Signal {
    static sceneInstance = null;

    static setSceneInstance(sceneInstance) {
        Signal.sceneInstance = sceneInstance;
    }

    static addObjectToScene(object, layer = 0) {
        if (Signal.sceneInstance) {
            Signal.sceneInstance.place(object, layer);
        } else {
            console.error("Scene instance not set. Please set it before using Signal.addObjectToScene.");
        }
    }

    static removeObjectFromScene(object, layer = 0) {
        if (Signal.sceneInstance) {
            Signal.sceneInstance.remove(object, layer);
        } else {
            console.error("Scene instance not set. Please set it before using Signal.removeObjectFromScene.");
        }
    }
}

export default Signal;
