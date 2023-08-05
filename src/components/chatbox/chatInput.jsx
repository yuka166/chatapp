import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../context/socket';

function ChatInput() {

    const { id } = useParams();

    const [message, setMessage] = useState('');

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        const chatInput = document.querySelector('.chat-input-field>textarea');
        chatInput.addEventListener('input', (e) => {
            if (e.target.scrollHeight / 22 < 7) {
                chatInput.style.height = 'auto';
                let scrollHeight = e.target.scrollHeight - 20;
                chatInput.style.height = `${scrollHeight}px`;
            }
            chatInput.scrollTop = e.target.scrollHeight - 20;
        })
    }, []);
    const sendMessage = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            if (message.trim() !== '') {
                const data = {
                    roomID: id,
                    content: message
                }
                socket.emit('sendMessage', data)
                setMessage('');
                document.querySelector('.chat-input-field>textarea').style.height = 'auto';
            }
            e.preventDefault();
        }
    }
    return (
        <div className='chat-input-field'>
            <textarea rows={1} placeholder='Send a message...'
                onChange={e => setMessage(e.target.value)}
                onKeyDown={sendMessage}
                value={message}
                autoFocus />
        </div>
    )
}

export default ChatInput;