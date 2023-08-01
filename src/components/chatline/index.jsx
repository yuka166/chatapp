import { memo } from 'react';
import './chatline.css';

function ChatLine(props) {
    return (
        <div className={props.sender ? 'r-chat' : 'l-chat'}>
            <div className='chat-username'>{props.username}</div>
            <div className="chat-wrap-details">
                <div className='chat-wrap-avatar sm-avatar'><img src={props.avatar} className='avatar' alt='' /></div>
                <div className='chat-wrap-content'>{props.content}</div>
            </div>
        </div>
    );
}

export default memo(ChatLine);