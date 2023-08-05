import { memo, useEffect } from 'react';
import DOMPurify from 'dompurify';
import './chatline.css';

function ChatLine(props) {

    let content;

    const sanitize = (links) => ({
        __html: DOMPurify.sanitize(links, { ALLOWED_TAGS: ['a'], ALLOWED_ATTR: ['href', 'target', 'rel'] })
    });

    const links = props.content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ig)
    if (links !== null) {
        links.map(link => {
            content = props.content.replace(link, `<a href='${link}' target='_blank' rel='noopener'>${link}</a>`)
        })
    }

    return (
        <div className={props.sender ? 'r-chat' : 'l-chat'}>
            <div className='chat-username'>{props.username}</div>
            <div className="chat-wrap-details">
                <div className='chat-wrap-avatar sm-avatar'><img src={props.avatar} className='avatar' alt='' /></div>
                {!content
                    ? <div className='chat-wrap-content' data-tooltip={props.time}>{props.content}</div>
                    : <div className='chat-wrap-content' data-tooltip={props.time} dangerouslySetInnerHTML={sanitize(content)} ></div>}
            </div>
        </div>
    );
}

export default memo(ChatLine);