function createWebSocket(url: string) {
    const webSocket = new WebSocket('ws://localhost:8080/ws' + url);
    webSocket.onopen = () => {
        console.log('连接成功');
    };

    webSocket.onmessage = (event) => {
        console.log('收到消息:', event.data);
    };

    webSocket.onerror = (error) => {
        console.error('连接错误:', error);
    };

    webSocket.onclose = () => {
        console.log('连接关闭');
    };
    return webSocket;
}
export default createWebSocket;