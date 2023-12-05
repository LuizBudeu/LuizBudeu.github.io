class Keyboard {
    static Keys = {
        ArrowLeft: "ArrowLeft",
        ArrowUp: "ArrowUp",
        ArrowRight: "ArrowRight",
        ArrowDown: "ArrowDown",
        Space: " ",
        Enter: "Enter",
        Shift: "Shift",
        Control: "Control",
        Alt: "Alt",
        W: "w",
        A: "a",
        S: "s",
        D: "d",
    };

    static keyStates = {};

    static initialize() {
        window.addEventListener("keydown", Keyboard.handleKeyDown);
        window.addEventListener("keyup", Keyboard.handleKeyUp);
    }

    static handleKeyDown(event) {
        Keyboard.keyStates[event.key] = true;
    }

    static handleKeyUp(event) {
        Keyboard.keyStates[event.key] = false;
    }

    static isKeyDown(key) {
        return Keyboard.keyStates[key] || false;
    }
}

export default Keyboard;
