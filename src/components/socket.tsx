import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token: string) {
  if (!socket) {
    socket = io("http://localhost:3000", {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
}
