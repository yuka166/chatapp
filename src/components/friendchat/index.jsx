import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SocketContext } from '../../context/socket';
import avatar from '../../assets/images/avatar.jpg';
import './friendchat.css';

function FriendChat(props) {

    const { id } = useParams();

    const { socket } = useContext(SocketContext);

    const [chatContent, setChatContent] = useState(props.content);

    useEffect(() => {
        socket.on('getMessage', data => {
            if (data.roomID === props.id) {
                setChatContent(data.content)
            }
        })
    }, []);

    return (
        <Link to={`/m/${props.id}`} className='friend-chat' data-active={props.id === id ? 'active' : 'inactive'}>
            <div className='friend-chat-avatar lg-avatar'><img src={avatar} className='avatar' alt='' /></div>
            <div className="friend-chat-details">
                <div className='friend-chat-name'>{props.name}</div>
                <div className='friend-chat-latest'>{chatContent}</div>
            </div>
        </Link>
    );
}

export default FriendChat;