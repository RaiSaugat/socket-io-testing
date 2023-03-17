import { useState } from 'react';
import { io } from 'socket.io-client';
import useLocalStorage from './hooks/useLocalStorage';
import { exportText } from './utils/helper';

const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useLocalStorage('message', '');
  const [connection, setConnection] = useState(false);

  const handleExport = () => {
    exportText(message);
  };

  socket.on('connect', () => {
    setConnection(true);
  });

  socket.on('disconnect', () => {
    setConnection(false);
  });

  return (
    <div className='wrapper'>
      <div className='heading'>
        <h1>Live Translation</h1>
        <div
          className={`connection ${connection ? 'connected' : 'disconnected'}`}
        >
          <span></span>
          <p>{connection ? 'Connected' : 'Disconnected'}</p>
        </div>
      </div>
      <textarea
        placeholder='Message'
        onChange={(e) => {
          setMessage(e.target.value);
          socket.emit('live-translate', e.target.value);
        }}
        value={message}
      >
        {message}
      </textarea>

      <button className='button' onClick={handleExport}>
        Export Speech
      </button>
    </div>
  );
}

export default App;
