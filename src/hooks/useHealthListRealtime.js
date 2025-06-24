import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function useHealthListRealtime() {
  const [healthList, setHealthList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('✅ Connected to WebSocket');
        stompClient.subscribe('/topic/health/progress', (message) => {
          const data = JSON.parse(message.body);
          setHealthList(data);
          setLoading(false);
        });
      },
      onStompError: (err) => console.error('STOMP error:', err),
      debug: () => {}, // Ẩn log nếu không cần
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return { healthList, loading };
}

export default useHealthListRealtime;
