// import { io } from "socket.io-client";

// const socket = io("https://api.top.onebluetrade.com/", {
//   transports: ["websocket", "polling"],
//   reconnectionAttempts: 5,
//   reconnectionDelay: 2000,
// });

// export default socket;

import { io } from "socket.io-client";

const socket = io("https://api.top.onebluetrade.com/", {
  transports: ["websocket", "polling"],

  // ✅ Infinite reconnection - NEVER give up
  reconnectionAttempts: Infinity,

  // ✅ Start with 2s, double each time (max 30s)
  reconnectionDelay: 2000,
  reconnectionDelayMax: 30000,

  // ✅ Keep-alive settings
  pingTimeout: 60000,    // 60 seconds before considering connection dead
  pingInterval: 25000,   // Send ping every 25 seconds

  // ✅ Connection timeout
  timeout: 20000,        // 20 seconds to connect initially
});

// ✅ LOG CONNECTION EVENTS (Remove in production if needed)
socket.on("connect", () => {
  console.log("✅ Frontend Socket Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Frontend Socket Disconnected:", reason);

  // These reasons mean Socket.io WILL auto-reconnect:
  // "io server disconnect" - Server forcefully disconnected
  // "io client disconnect" - Client manually disconnected
  // "ping timeout" - Server didn't respond to ping
  // "transport close" - Connection was closed
  // "transport error" - Connection error
});

socket.on("connect_error", (error) => {
  console.error("❌ Frontend Socket Connection Error:", error.message);
});

socket.on("reconnect", (attemptNumber) => {
  console.log(`✅ Frontend Socket Reconnected after ${attemptNumber} attempts`);
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log(`🔄 Frontend Reconnect Attempt ${attemptNumber}...`);
});

socket.on("reconnect_failed", () => {
  console.error("❌ Frontend Socket Reconnection Failed Permanently");
});

export default socket;
