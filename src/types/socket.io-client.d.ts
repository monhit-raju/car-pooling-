declare module 'socket.io-client' {
  import { Manager, Socket } from 'socket.io-client';
  export { Manager, Socket };
  export default function io(uri: string, opts?: any): Socket;
}