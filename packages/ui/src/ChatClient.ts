export type ChatClientOptions = {
    maxRetryCount?: number;

    retryDelay?: number;
};

export class ChatClient extends EventTarget {
    private readonly maxRetryCount: number;
    private readonly retryDelay: number;
    private readonly url: string;
    private currentRetry: number;

    public constructor(url: string, options: ChatClientOptions = {}) {
        super();
        this.url = url;
        this.maxRetryCount = options.maxRetryCount ?? 10;
        this.retryDelay = options.retryDelay ?? 500;
        this.currentRetry = 0;
        this.reconnect();
    }

    private handleReconnectFailure = () => {
        setTimeout(this.reconnect, this.retryDelay);
    };

    private handleReconnectSuccess = (event: Event) => {
        const socket = event.target as WebSocket;
        this.currentRetry = 0;
        socket.removeEventListener('close', this.handleReconnectFailure);
        socket.removeEventListener('error', this.handleReconnectFailure);
        this.handleSocketConnection(socket);
    };

    private handleSocketConnection = (socket: WebSocket) => {
        socket.addEventListener('close', () => {});
        socket.addEventListener('error', () => {});
        socket.addEventListener('message', () => {});
    };

    private reconnect = () => {
        if (this.maxRetryCount >= this.currentRetry) {
            throw new Error('Retry count exceeded limit.');
        }

        ++this.currentRetry;
        const socket = new WebSocket(this.url);

        socket.addEventListener('close', this.handleReconnectFailure);
        socket.addEventListener('error', this.handleReconnectFailure);
        socket.addEventListener('open', this.handleReconnectSuccess);
    };

    public addEventListener(
        type: 'open',
        callback: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions | undefined,
    ): void;

    public addEventListener(
        type: 'connection_error',
        callback: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions | undefined,
    ): void;

    public addEventListener(
        type: 'error',
        callback: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions | undefined,
    ): void;

    public addEventListener(
        type: 'close',
        callback: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions | undefined,
    ): void;

    public addEventListener(
        type: 'ping',
        callback: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions | undefined,
    ): void;

    public addEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions | undefined,
    ): void {
        super.addEventListener(type, callback, options);
    }
}
