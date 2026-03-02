import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token: string) {
  if (!socket) {
    socket = io(import.meta.env.VITE_SERVER_URL, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
}
