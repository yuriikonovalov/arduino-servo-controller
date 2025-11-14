export interface TCPClientListener {
    onDisconnected(): void;

    onError(): void;

}