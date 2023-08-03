import { Link, useParams } from 'react-router-dom';
import avatar from '../../assets/images/avatar.jpg';
import './friendchat.css';

function FriendChat(props) {

    const { id } = useParams();

    return (
        <Link to={`/m/${props.id}`} className='friend-chat' data-active={props.id === id ? 'active' : 'inactive'}>
            <div className='friend-chat-avatar lg-avatar'><img src={avatar} className='avatar' alt='' /></div>
            <div className="friend-chat-details">
                <div className='friend-chat-name'>{props.name}</div>
                <div className='friend-chat-latest'>{props.content}</div>
            </div>
        </Link>
    );
}

export default FriendChat;