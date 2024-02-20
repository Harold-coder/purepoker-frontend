class PokerWebsocketService {
    constructor() {
      this.ws = null;
      this.isConnected = false;
    }
  
    connect() {
      if (this.isConnected) {
        console.log("WebSocket is already connected.");
        return;
      }

      this.ws = new WebSocket("wss://6r5wma2l7i.execute-api.us-east-1.amazonaws.com/dev/");
      this.ws.onopen = this.onOpen;
      this.ws.onmessage = this.onMessage;
      this.ws.onclose = this.onClose;
      this.ws.onerror = this.onError;
    }
  
    onOpen = () => {
      console.log("WebSocket connection opened");
      this.isConnected = true;
    };
  
    onMessage = (event) => {
      console.log("Message received:", JSON.parse(event.data));
    };
  
    onClose = (event) => {
      console.log("WebSocket connection closed", `Code: ${event.code}`, `Reason: ${event.reason}`);
      this.isConnected = false;
      // Consider implementing reconnection logic here
    };
  
    onError = (error) => {
      console.error("WebSocket error observed:", error);
      // Consider implementing reconnection or error handling logic here
    };
  
    sendMessage(action, data) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ action, ...data });
        console.log(`Sending message: ${message}`);
        this.ws.send(message);
      } else {
        console.error("WebSocket is not connected. Attempting to reconnect...");
        this.connect(); // Attempt to reconnect if not connected
        // Consider delaying the send operation until the connection is established
      }
    }
  
    disconnect() {
      if (this.ws) {
        console.log("Disconnecting WebSocket...");
        this.ws.close();
        this.isConnected = false;
      }
    }
  }
  
  // Export a singleton instance of the service
  export const websocketService = new PokerWebsocketService();