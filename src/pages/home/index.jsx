import { useContext, useEffect, useState } from 'react';
import { useOutlet } from 'react-router-dom';
import axios from 'axios';
import FriendChat from '../../components/friendchat';
import { SocketProvider, SocketContext } from '../../context/socket';
import './home.css';

function HomePage() {

    const [isLoading, setIsLoading] = useState(true);
    const [chatList, setChatList] = useState([]);

    const socket = useContext(SocketContext);

    const outlet = useOutlet();

    useEffect(() => {
        socket.connect();
        axios.get('https://nice-chat-app.fly.dev/rooms', { withCredentials: true })
            .then((res) => {
                setChatList(res.data)
                setIsLoading(false)
                socket.emit('joinRooms', res.data)
            })
            .catch((e) => console.log(e))

    }, []);

    return (
        <SocketProvider>
            <div className="chat">
                <div className="friend-chat-list">
                    {isLoading ? <div>loading</div> : chatList.map((item, i) => {
                        let name = '', content = '';
                        item.members.length > 1 ? name = item.name : name = item.members[0].username
                        item.latestChat.length > 0 ? content = item.latestChat[0].content : content = ''
                        return (
                            <FriendChat key={i} name={name} content={content} id={item._id} />
                        )
                    })}
                </div>
                {outlet || <div className='no-chat'>Select a chat to start messaging...</div>}
                {/* <div className="chat-wrap">
                <div className='chat-list'>
                    {messageList.map((m, i) =>
                        <div key={i} className={`${m.id === id ? 'r-chat' : 'l-chat'}`}>
                            <div className='chat-wrap-avatar sm-avatar'><img src={avatar} className='avatar' alt='' /></div>
                            <div className='chat-wrap-content'>{m.content}</div>
                        </div>
                    )}
                </div>
                <div className='chat-input-field'>
                    <textarea rows={1} placeholder='Send a message...'
                        onKeyDown={onEnterPress}
                        onChange={e => setMessage(e.target.value)} value={message} />
                </div>
            </div> */}
            </div>
        </SocketProvider>
    );
}

export default HomePage;