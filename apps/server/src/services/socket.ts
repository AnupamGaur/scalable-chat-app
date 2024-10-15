import Redis from "ioredis"
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const pub = new Redis(`${process.env.REDIS_URL}`)
const sub = new Redis(`${process.env.REDIS_URL}`)

class SocketService {
  private _io:Server;
  constructor() {
    console.log("Init socket services");
    this._io = new Server(
      {
        cors: {
          origin: "*",
          allowedHeaders: ["*"]
        }
      }
    );
    sub.subscribe('MESSAGE')
  }

  get io(){
    return this._io;
  }

  initListener(){
    const io = this.io;

    sub.on('message', (channel, message) => {
      if(channel === 'MESSAGE') 
      io.emit('message', JSON.parse(message));
    });

    io.on("connect", (socket) => {
      console.log(`New client connected: ${socket.id}`);
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
      socket.on("event:message", async (msg) => {
        await pub.publish("MESSAGE", JSON.stringify(msg));

      });
    });
    
  }
}

export default SocketService;
