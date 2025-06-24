// services/SocketService.ts
let socket: WebSocket | null = null;

export const connectWebSocket = () => {
  socket = new WebSocket('wss://www.choyou.fr/wss2');

  socket.onopen = () => {
    console.log('✅ WebSocket connected');
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('📩 Message reçu via WebSocket :', data);
    } catch (e) {
      console.error('❌ Erreur parsing WebSocket message :', e);
    }
  };  

  socket.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
  };

  socket.onclose = () => {
    console.warn('⚠️ WebSocket closed');
    // Reconnexion possible ici plus tard
  };
};

export const getWebSocket = (): WebSocket | null => socket;
