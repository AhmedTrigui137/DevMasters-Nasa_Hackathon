const WS_BASE = (import.meta.env.VITE_WS_BASE) || (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + (import.meta.env.VITE_API_HOST || 'localhost:8000');

type MessageHandler = (data: any) => void;

export class ReconnectingWebSocket {
  private url: string;
  private ws: WebSocket | null = null;
  private handler: MessageHandler | null = null;
  private reconnectDelay = 1000;
  private shouldReconnect = true;

  constructor(path = '/ws/updates') {
    this.url = `${WS_BASE}${path}`;
    this.connect();
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        this.reconnectDelay = 1000;
      };
      this.ws.onmessage = (ev) => {
        try {
          const parsed = JSON.parse(ev.data as string);
          if (this.handler) this.handler(parsed);
        } catch (e) {
          // ignore
        }
      };
      this.ws.onclose = () => {
        if (!this.shouldReconnect) return;
        setTimeout(() => this.connect(), this.reconnectDelay);
        this.reconnectDelay = Math.min(30000, this.reconnectDelay * 1.5);
      };
      this.ws.onerror = () => {
        try { this.ws?.close(); } catch(e) {}
      };
    } catch (e) {
      setTimeout(() => this.connect(), this.reconnectDelay);
    }
  }

  onMessage(fn: MessageHandler) {
    this.handler = fn;
  }

  close() {
    this.shouldReconnect = false;
    try { this.ws?.close(); } catch(e){}
  }
}

export default ReconnectingWebSocket;
