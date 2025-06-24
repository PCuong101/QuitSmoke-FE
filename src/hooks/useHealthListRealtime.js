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
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('✅ WebSocket connected');

                const sessionId = stompClient.webSocket._transport.url
                    .split('/')
                    .slice(-2)[0]
                    .replace(/[^a-zA-Z0-9\-]/g, '');

                stompClient.subscribe(`/topic/health/progress/${sessionId}`, (message) => {
                    const data = JSON.parse(message.body);
                    setHealthList(data);
                    setLoading(false);
                });

                // 👉 Lặp lại publish request-progress mỗi 1 giây
                const interval = setInterval(() => {
                    stompClient.publish({
                        destination: '/app/request-progress',
                        body: '{}'
                    });
                }, 1000);

                // Clear khi rời component
                return () => {
                    clearInterval(interval);
                    stompClient.deactivate();
                };
            },
            onStompError: (frame) => {
                console.error('❌ STOMP error:', frame);
            }
        });

        stompClient.activate();
    }, []);


    return { healthList, loading };
}

export default useHealthListRealtime;
