import { io } from "socket.io-client";

const socket = io("http://localhost:5000/", {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;
