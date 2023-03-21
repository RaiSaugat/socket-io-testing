import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import FontPicker from 'font-picker-react';

import useLocalStorage from './hooks/useLocalStorage';
import { exportText } from './utils/helper';

const url = 'https://socket-io-pi5g.onrender.com/';

const connectSocket = () => {
  const socket = io(url);

  return socket;
};

function App() {
  const [message, setMessage] = useLocalStorage('message', '');
  const [connection, setConnection] = useState(false);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [fontColor, setFontColor] = useState<string>('#000000');
  const [fontFamily, setFontFamily] = useState<string>('Open Sans');
  const [fontSize, setFontSize] = useState<string>('16');
  const [width, setWidth] = useState<string>('800');
  const [height, setHeight] = useState<string>('100');

  const backgroundRef = useRef<any>();
  const fontColorRef = useRef<any>();
  const fontSizeRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let socket = connectSocket();

    socket.on('connect', () => {
      setConnection(true);
    });

    socket.on('disconnect', () => {
      setConnection(false);
    });

    const scrollToLastMessage = () => {
      let message = messageRef.current;
      message?.scroll({
        top: message.scrollHeight,
        behavior: 'smooth',
      });
    };
    socket.on('live-translate-receive', (data) => {
      flushSync(() => {
        setMessage(data);
      });
      scrollToLastMessage();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (fontColorRef && fontColorRef.current) {
      document.documentElement.style.setProperty(
        '--font-color',
        fontColorRef.current?.value || '#000000'
      );
    }
  }, [fontColor]);

  useEffect(() => {
    if (backgroundRef && backgroundRef.current) {
      document.documentElement.style.setProperty(
        '--bg-color',
        backgroundRef.current?.value || '#ffffff'
      );
    }
  }, [bgColor]);

  useEffect(() => {
    if (fontSizeRef && fontSizeRef.current) {
      const size = fontSizeRef.current?.value
        ? fontSizeRef.current?.value + 'px'
        : '16px';
      document.documentElement.style.setProperty('--font-size', size);
    }
  }, [fontSize]);

  useEffect(() => {
    if (widthRef && widthRef.current) {
      const size = widthRef.current?.value
        ? widthRef.current?.value + 'px'
        : '800px';
      document.documentElement.style.setProperty('--width', size);
    }
  }, [width]);

  useEffect(() => {
    if (heightRef && heightRef.current) {
      const size = heightRef.current?.value
        ? heightRef.current?.value + 'px'
        : '100px';
      document.documentElement.style.setProperty('--height', size);
    }
  }, [height]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setWidth('350');
      setFontSize('14');
    }
  }, []);

  const handleExport = () => {
    exportText(message);
  };

  return (
    <div className='wrapper'>
      <div
        className={`connection ${connection ? 'connected' : 'disconnected'}`}
      >
        <span></span>
        <p>{connection ? 'Connected' : 'Disconnected'}</p>
      </div>
      <div ref={messageRef} className='message apply-font'>
        {message}
      </div>

      <div className='buttons__wrapper'>
        <h3>Customize</h3>

        <div className='configures'>
          <div className='configure__button'>
            <p>Width</p>

            <input
              ref={widthRef}
              type='number'
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          <div className='configure__button'>
            <p>Height</p>

            <input
              ref={heightRef}
              type='number'
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div className='configure__button'>
            <p>Background</p>
            <label
              className='pseudo__color'
              style={{ backgroundColor: bgColor }}
            >
              <input
                ref={backgroundRef}
                type='color'
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </label>
          </div>
          <div className='configure__button'>
            <p>Font</p>
            <label
              className='pseudo__color'
              style={{ backgroundColor: fontColor }}
            >
              <input
                ref={fontColorRef}
                type='color'
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
              />
            </label>
          </div>
          <div className='configure__button'>
            <p>Size</p>
            <input
              ref={fontSizeRef}
              type='number'
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            />
          </div>
          <div className='configure__button'>
            <p>Style</p>
            <FontPicker
              apiKey={import.meta.env.VITE_GOOGLE_FONT_API_KEY}
              activeFontFamily={fontFamily}
              onChange={(nextFont) => setFontFamily(nextFont.family)}
            />
          </div>
        </div>
        <button className='export__button' onClick={handleExport}>
          Export Speech
        </button>
      </div>
    </div>
  );
}

export default App;
