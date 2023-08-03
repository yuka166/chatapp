import { useContext, useEffect, useState } from 'react';
import { useOutlet, useParams } from 'react-router-dom';
import axios from 'axios';
import FriendChat from '../../components/friendchat';
import { SocketProvider, SocketContext } from '../../context/socket';
import './home.css';

function HomePage() {

    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [chatList, setChatList] = useState([]);

    const socket = useContext(SocketContext);

    const outlet = useOutlet();

    useEffect(() => {
        socket.connect();
        socket.emit('getRooms')
        socket.on('allRooms', data => {
            setChatList(data)
            setIsLoading(false)
        })
        socket.on('setRoom', () => {
            socket.emit('getRooms')
        })

        window.addEventListener('resize', () => {
            document.querySelector('.chat').style.height = `${window.innerHeight}px`;
            console.log(document.querySelector('.chat').style.height)
        })
    }, []);

    useEffect(() => {
        if (window.innerWidth < 551) {
            id ? document.querySelector('.friend-chat-list').style.display = 'none'
                : document.querySelector('.friend-chat-list').style.display = 'block'
        }
        else {
            document.querySelector('.friend-chat-list').style.display = 'block'
        }
    }, [id]);

    return (
        <SocketProvider>
            <div className="chat">
                <div className="friend-chat-list">
                    {isLoading ? <div>loading</div> : chatList.map((item, i) => {
                        let name = '', content = '';
                        item.members.length > 1 ? name = item.name : name = item.members[0].username
                        item.latestChat.length > 0 ? content = item.latestChat[0].content : content = ''
                        if (item.members.length < 2) {
                            if (item.latestChat.length > 0) {
                                return (
                                    <FriendChat key={i} name={name} content={content} id={item._id} />
                                )
                            }
                        }
                        else {
                            return (
                                <FriendChat key={i} name={name} content={content} id={item._id} />
                            )
                        }
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