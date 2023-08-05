import { memo } from 'react';
import DOMPurify from 'dompurify';
import './chatline.css';

function ChatLine(props) {

    let linksArr = [];
    let content;

    const sanitize = (links) => ({
        __html: DOMPurify.sanitize(links, { ALLOWED_TAGS: ['a'], ALLOWED_ATTR: ['href', 'target', 'rel'] })
    });

    props.content.map((item, i) => {
        let link = item.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ig);
        if (link) {
            linksArr.push(link);
            content = props.content;
        }
    })

    if (linksArr.length > 0) {
        let newLinksArr = linksArr.map(link => {
            if (link.length < 2) {
                return link.toString()
            }
            return link
        })

        newLinksArr = [...new Set(newLinksArr)];

        newLinksArr.map(link => {
            if (typeof link !== 'string') {
                link.map(link => {
                    content = content.map(item => {
                        return item.replace(link, `<a href='${link}' target='_blank' rel='noopener'>${link}</a>`)
                    })
                })
            }
            else {
                content = content.map(item => {
                    return item.replace(link, `<a href='${link}' target='_blank' rel='noopener'>${link}</a>`)
                })
            }
        })
    }

    return (
        <div className={props.sender ? 'r-chat' : 'l-chat'}>
            <div className='chat-username'>{props.username}</div>
            <div className="chat-wrap-details">
                <div className='chat-wrap-avatar sm-avatar'><img src={props.avatar} className='avatar' alt='' /></div>
                {
                    /* {!content
                        ? <div className='chat-wrap-content' data-tooltip={props.time}>{props.content}</div>
                        : <div className='chat-wrap-content' data-tooltip={props.time} dangerouslySetInnerHTML={sanitize(content)} ></div>} */
                }
                {
                    props.content.length === 1
                        ? content
                            ? <div className='chat-wrap-content' data-tooltip={props.time} dangerouslySetInnerHTML={sanitize(content)}></div>
                            : <div className='chat-wrap-content' data-tooltip={props.time}>{props.content[0]}</div>
                        :
                        <div>
                            {content
                                ? content.map((item, i) => {
                                    return (
                                        <div key={i} className='chat-wrap-content multi-line' data-tooltip={props.time}
                                            dangerouslySetInnerHTML={sanitize(item)}></div>
                                    )
                                })
                                : props.content.map((item, i) => {
                                    return (
                                        <div key={i} className='chat-wrap-content multi-line' data-tooltip={props.time}>{item}</div>
                                    )
                                })}
                        </div>
                }
            </div>
        </div>
    );
}

export default memo(ChatLine);