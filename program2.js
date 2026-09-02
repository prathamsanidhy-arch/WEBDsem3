
const EventEmitter = require("events");

const eventEmitter = new EventEmitter();


eventEmitter.on("click", () => {
    console.log("Button clicked!");
});

eventEmitter.on("mouseover", () => {
    console.log("Mouse is over the button!");
});

eventEmitter.on("dblclick", () => {
    console.log("Button double clicked!");
});

console.log("Simulating Events...\n");

eventEmitter.emit("click");
eventEmitter.emit("mouseover");
eventEmitter.emit("dblclick");