import TwoWayMap from "../utils/twoWayMap.js";

class Mouse {
    static canvas = null;
    static position = { x: 0, y: 0 };
    static leftButtonPressed = false;
    static rightButtonPressed = false;
    static leftClickDragStart = { x: 0, y: 0 };
    static leftClickDragging = false;
    static rightClickDragStart = { x: 0, y: 0 };
    static rightClickDragging = false;

    static initialize(canvas) {
        if (Mouse.canvas) {
            console.error("Mouse is already initialized.");
            return;
        }

        Mouse.canvas = canvas;

        // Event listeners for mouse movement and clicks
        Mouse.canvas.addEventListener("mousemove", Mouse.handleMouseMove);
        Mouse.canvas.addEventListener("mousedown", Mouse.handleMouseDown);
        Mouse.canvas.addEventListener("mouseup", Mouse.handleMouseUp);

        Mouse.rightClickDownEvents = [];
        Mouse.rightClickUpEvents = [];
        Mouse.leftClickDownEvents = [];
        Mouse.leftClickUpEvents = [];
        Mouse.mouseMoveEvents = [];
        Mouse.leftClickDraggingEvents = [];
        Mouse.rightClickDraggingEvents = [];
    }

    static handleMouseDown(event) {
        Mouse.updatePosition(event);
        if (event.button === 0) {
            Mouse.leftButtonPressed = true;
            Mouse.handleLeftClickDown(event);

            if (!Mouse.leftClickDragging) {
                Mouse.leftClickDragStart = { ...Mouse.position };
                Mouse.leftClickDragging = true;
            }
        } else if (event.button === 2) {
            Mouse.rightButtonPressed = true;
            Mouse.handleRightClickDown(event);

            if (!Mouse.rightClickDragging) {
                Mouse.rightClickDragStart = { ...Mouse.position };
                Mouse.rightClickDragging = true;
            }
        }
    }

    static handleMouseUp(event) {
        Mouse.updatePosition(event);
        if (event.button === 0) {
            Mouse.leftButtonPressed = false;
            Mouse.handleLeftClickUp(event);
            Mouse.leftClickDragging = false;
        } else if (event.button === 2) {
            Mouse.rightButtonPressed = false;
            Mouse.handleRightClickUp(event);
            Mouse.rightClickDragging = false;
        }
    }

    static updatePosition(event) {
        const rect = Mouse.canvas.getBoundingClientRect();
        Mouse.position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    static getPosition() {
        return { ...Mouse.position };
    }

    static addRightClickDownEvent(callback, targetGameObject = null) {
        Mouse.rightClickDownEvents.push({ callback, targetGameObject });
    }

    static removeRightClickEvent(callback) {
        Mouse.rightClickDownEvents = Mouse.rightClickDownEvents.filter((cb) => cb !== callback);
    }

    static addRightClickUpEvent(callback, targetGameObject = null) {
        Mouse.rightClickUpEvents.push({ callback, targetGameObject });
    }

    static removeRightClickUpEvent(callback) {
        Mouse.rightClickUpEvents = Mouse.rightClickUpEvents.filter((cb) => cb !== callback);
    }

    static addLeftClickUpEvent(callback, targetGameObject = null) {
        Mouse.leftClickUpEvents.push({ callback, targetGameObject });
    }

    static removeLeftClickUpEvent(callback) {
        Mouse.LeftClickUpEvents = Mouse.LeftClickUpEvents.filter((cb) => cb !== callback);
    }

    static addLeftClickDownEvent(callback, targetGameObject = null) {
        Mouse.leftClickDownEvents.push({ callback, targetGameObject });
    }

    static removeLeftClickEvent(callback) {
        Mouse.leftClickDownEvents = Mouse.leftClickDownEvents.filter((cb) => cb !== callback);
    }

    static addMouseMoveEvent(callback) {
        Mouse.mouseMoveEvents.push(callback);
    }

    static removeMouseMoveEvent(callback) {
        Mouse.mouseMoveEvents = Mouse.mouseMoveEvents.filter((cb) => cb !== callback);
    }

    static addLeftClickDraggingEvent(callback, targetGameObject = null) {
        Mouse.leftClickDraggingEvents.push({ callback, targetGameObject });
    }

    static removeLeftDraggingEvent(callback) {
        Mouse.leftClickDraggingEvents = Mouse.leftClickDraggingEvents.filter((cb) => cb !== callback);
    }

    static addRightClickDraggingEvent(callback, targetGameObject = null) {
        Mouse.rightClickDraggingEvents.push({ callback, targetGameObject });
    }

    static removeRightDraggingEvent(callback) {
        Mouse.rightClickDraggingEvents = Mouse.rightClickDraggingEvents.filter((cb) => cb !== callback);
    }

    static handleRightClickDown(event) {
        const { x, y } = Mouse.getPosition();

        Mouse.rightClickDownEvents.forEach(({ callback, targetGameObject }) => {
            if (targetGameObject && !Mouse.isOver(targetGameObject)) return;

            callback({
                x,
                y,
                button: "right",
            });
        });
    }

    static handleRightClickUp(event) {
        const { x, y } = Mouse.getPosition();

        Mouse.rightClickUpEvents.forEach(({ callback, targetGameObject }) => {
            if (targetGameObject && !Mouse.isOver(targetGameObject)) return;

            callback({
                x,
                y,
                button: "right",
            });
        });
    }

    static handleLeftClickDown(event) {
        const { x, y } = Mouse.getPosition();

        Mouse.leftClickDownEvents.forEach(({ callback, targetGameObject }) => {
            if (targetGameObject && !Mouse.isOver(targetGameObject)) return;

            callback({
                x,
                y,
                button: "left",
            });
        });
    }

    static handleLeftClickUp(event) {
        const { x, y } = Mouse.getPosition();

        Mouse.leftClickUpEvents.forEach(({ callback, targetGameObject }) => {
            if (targetGameObject && !Mouse.isOver(targetGameObject)) return;

            callback({
                x,
                y,
                button: "left",
            });
        });
    }

    static handleMouseMove(event) {
        Mouse.updatePosition(event);
        const { x, y } = Mouse.getPosition();

        if (Mouse.leftButtonPressed) Mouse.handleLeftClickDragging(event);
        if (Mouse.rightButtonPressed) Mouse.handleRightClickDragging(event);

        Mouse.mouseMoveEvents.forEach((callback) => {
            callback({
                x,
                y,
            });
        });
    }

    static handleLeftClickDragging(event) {
        const { x, y } = Mouse.getPosition();

        Mouse.leftClickDraggingEvents.forEach(({ callback, targetGameObject }) => {
            if (targetGameObject && !Mouse.isOver(targetGameObject)) return;

            const deltaX = x - Mouse.leftClickDragStart.x;
            const deltaY = y - Mouse.leftClickDragStart.y;

            callback({
                x,
                y,
                dragStartX: Mouse.leftClickDragStart.x,
                dragStartY: Mouse.leftClickDragStart.y,
                deltaX,
                deltaY,
            });

            Mouse.leftClickDragStart = { ...Mouse.position };
        });
    }

    static handleRightClickDragging(event) {
        const { x, y } = Mouse.getPosition();

        Mouse.rightClickDraggingEvents.forEach(({ callback, targetGameObject }) => {
            if (targetGameObject && !Mouse.isOver(targetGameObject)) return;

            const deltaX = x - Mouse.rightClickDragStart.x;
            const deltaY = y - Mouse.rightClickDragStart.y;

            callback({
                x,
                y,
                dragStartX: Mouse.rightClickDragStart.x,
                dragStartY: Mouse.rightClickDragStart.y,
                deltaX,
                deltaY,
            });

            Mouse.rightClickDragStart = { ...Mouse.position };
        });
    }

    static isLeftButtonDown() {
        return Mouse.leftButtonPressed;
    }

    static isRightButtonDown() {
        return Mouse.rightButtonPressed;
    }

    static isOver(gameObject) {
        const { x, y } = Mouse.position;
        return x >= gameObject.x && x <= gameObject.x + gameObject.width && y >= gameObject.y && y <= gameObject.y + gameObject.height;
    }
}

export default Mouse;
