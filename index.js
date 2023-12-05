import Core from "./engine/core.js";

const canvas = document.getElementById("circuit-canvas");
const ctx = canvas.getContext("2d");

const core = new Core(canvas, ctx);
core.start();
