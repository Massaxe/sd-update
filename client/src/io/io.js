import io from "socket.io-client";
const socket = io("http://localhost:4001");

socket.on("welcome", data => {
    console.log(data)
});

function LogSocket() {}

export { LogSocket };
