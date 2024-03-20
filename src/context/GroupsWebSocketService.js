class GroupsWebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = [];
    this.messageQueue = [];
    this.connectionState = 'closed'; // 'connecting', 'open', 'closed'
  }

  isConnected = () => {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  connect(groupId, userId) {
    this.currentGroupId = groupId;
    this.currentUserId = userId;
    // Prevent multiple connections
    if (this.connectionState !== 'closed') {
      console.log('Connection attempt ignored. Current state:', this.connectionState);
      return;
    }

    this.connectionState = 'connecting';
    const queryParams = [`groupId=${encodeURIComponent(groupId)}`, `userId=${encodeURIComponent(userId)}`];
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    this.ws = new WebSocket(`wss://438e2pak9e.execute-api.us-east-1.amazonaws.com/dev/${queryString}`);

    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onclose = this.onClose;
    this.ws.onerror = this.onError;
  }

  onOpen = () => {
    console.log("WebSocket connection opened");
    this.connectionState = 'open';
    this.processQueue(); // Process queued messages
    
    // Automatically join chat upon connection
    if (this.currentGroupId && this.currentUserId) {
      this.sendMessage('joinChat', { groupId: this.currentGroupId, userId: this.currentUserId });
    }
  };

  onMessage = (event) => {
    console.log("Message received:", event.data);
    const data = JSON.parse(event.data);
    this.listeners.forEach((listener) => listener(data));
  };

  onClose = (event) => {
    console.log("WebSocket connection closed", `Code: ${event.code}`, `Reason: ${event.reason}`);
    this.connectionState = 'closed';
  };

  onError = (error) => {
    console.error("WebSocket error observed:", error);
    this.connectionState = 'closed';
  };

  sendMessage = (action, data) => {
    if (this.isConnected()) {
      const message = JSON.stringify({ action, ...data });
      console.log(`Sending message: ${message}`);
      this.ws.send(message);
    } else {
      console.error("WebSocket is not connected. Queuing message.");
      this.messageQueue.push({ action, data });
      // Attempt to reconnect if not connected
      if (this.connectionState === 'closed') {
        console.log("Attempting to reconnect...");
        this.connect(data.groupId, data.userId);
      }
    }
  }

  processQueue = () => {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      this.sendMessage(message.action, message.data);
    }
  }

  addMessageListener(listener) {
    this.listeners.push(listener);
  }

  removeMessageListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  disconnect() {
    if (this.ws) {
      console.log("Disconnecting WebSocket...");
      this.ws.close();
    }
  }
}

export const groupsWebSocketService = new GroupsWebSocketService();
