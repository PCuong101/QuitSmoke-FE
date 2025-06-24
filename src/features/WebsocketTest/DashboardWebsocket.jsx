import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const DashboardWebsocket = () => {
  if (typeof global === 'undefined') {
  window.global = window;
}
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to /ws');
        stompClient.subscribe('/topic/health/progress', (message) => {
          const data = JSON.parse(message.body);
          setTasks(data);
        });
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Task Progress Dashboard</h2>
      <table  style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Time Remaining</th>
            <th>Progress</th>
            <th>Achieved</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t, index) => (
            <tr key={index}>
              <td>{t.name}</td>
              <td>{t.timeRemaining}</td>
              <td>
                <div style={{ width: '100px', background: '#eee' }}>
                  <div
                    style={{
                      width: `${t.progressPercent}%`,
                      background: t.achieved ? 'green' : 'orange',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    {t.progressPercent}%
                  </div>
                </div>
              </td>
              <td>{t.achieved ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardWebsocket;
