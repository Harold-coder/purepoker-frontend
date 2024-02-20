class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false; // Add an isConnected flag
  }

  connect(onMessage) {
    if (this.isConnected) {
      console.log('WebSocket is already connected.');
      return; // Exit if already connected
    }

    const url = 'wss://sr1ikhttn3.execute-api.us-east-1.amazonaws.com/dev/';
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('Connected to the WebSocket');
      this.isConnected = true; // Set flag to true when connected
    };

    this.ws.onmessage = (e) => {
      try {
        // Attempt to parse the incoming message as JSON
        const message = JSON.parse(e.data);
        onMessage(message);
      } catch (error) {
        console.error("Error parsing message as JSON:", e.data, error);
        // Call onMessage with the raw text if JSON parsing fails
        onMessage({ message: e.data });
      }
    };

    this.ws.onclose = () => {
      console.log('Disconnected from the WebSocket');
      this.isConnected = false; // Reset flag on disconnect
      // Removed automatic reconnection logic
    };
  }

  sendMessage(message) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify({ action: 'sendMessage', message }));
    } else {
      console.log('WebSocket is not connected.');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const webSocketService = new WebSocketService();
