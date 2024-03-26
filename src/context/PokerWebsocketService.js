class PokerWebsocketService {
    constructor() {
      this.ws = null;
      this.listeners = [];
      this.messageQueue = [];
    }
  
    connect() {

      const gameId = localStorage.getItem('gameId');
      const user = JSON.parse(localStorage.getItem('user'));
      var playerUsername = '';
      if (user) {
        playerUsername = user.username;
      }

      const queryParams = [];

      
      if (gameId) {
          queryParams.push(`gameId=${encodeURIComponent(gameId)}`);
      }
      if (playerUsername) {
          queryParams.push(`playerId=${encodeURIComponent(playerUsername)}`);
      }

      const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
      this.ws = new WebSocket(`wss://6r5wma2l7i.execute-api.us-east-1.amazonaws.com/dev/${queryString}`);

      // this.ws = new WebSocket("wss://6r5wma2l7i.execute-api.us-east-1.amazonaws.com/dev/");
      this.ws.onopen = this.onOpen;
      this.ws.onmessage = this.onMessage;
      this.ws.onclose = this.onClose;
      this.ws.onerror = this.onError;
    }
  
    onOpen = () => {
      console.log("WebSocket connection opened");
      
      // Send all queued messages
      while (this.messageQueue.length > 0) {
          const { action, data } = this.messageQueue.shift(); // Remove the message from the queue
          this.sendMessage(action, data); // Send the message
      }
    };

    // Modify onMessage to handle custom logic
    onMessage = (event) => {
      console.log("Message received:", event.data);
      const data = JSON.parse(event.data);
      this.listeners.forEach((listener) => listener(data));
    };

    addMessageListener(listener) {
      this.listeners.push(listener);
    }
  
    removeMessageListener(listener) {
      this.listeners = this.listeners.filter((l) => l !== listener);
    }
  
    onClose = (event) => {
      console.log("WebSocket connection closed", `Code: ${event.code}`, `Reason: ${event.reason}`);
    };
  
    onError = (error) => {
      console.error("WebSocket error observed:", error);
      // Consider implementing reconnection or error handling logic here
    };
  
    sendMessage(action, data) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({ action, ...data });
          this.ws.send(message);
      } else {
          // Queue the message
          this.messageQueue.push({ action, data });
  
          // Attempt to reconnect if not connected
          if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
              console.error("WebSocket is not connected. Attempting to reconnect...");
              this.connect();
          }
      }
    }

    disconnect() {
      if (this.ws) {
        console.log("Disconnecting WebSocket...");
        this.ws.close();
      }
    }
  }
  
  // Export a singleton instance of the service
  export const websocketService = new PokerWebsocketService();