import { useState, useEffect, useContext, memo, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import { SocketContext } from '../../context/socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ChatLine from '../chatline';
import avatar from '../../assets/images/avatar.jpg';
import './chatbox.css';

function ChatBox() {

    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);
    const [roomDetails, setRoomDetails] = useState([]);
    const { socket, userID } = useContext(SocketContext);

    useEffect(() => {
        setIsLoading(true)
        axios.get(`https://nice-chat-app.fly.dev/chats/${id}`, { withCredentials: true })
            .then((res) => {
                setChatHistory(res.data)
                setIsLoading(false)
            })
            .catch((e) => console.log(e))

        axios.get(`https://nice-chat-app.fly.dev/rooms/${id}`, { withCredentials: true })
            .then((res) => {
                setRoomDetails(res.data)
            })
            .catch((e) => console.log(e))

        socket.on('getMessage', data => {
            if (id === data.roomID) {
                setChatHistory(prev => [...prev, data])
            }
        })

        return () => {
            socket.off('getMessage');
        };

    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    useEffect(() => {
        document.querySelector('.chat-list').scrollTop = document.querySelector('.chat-list').scrollHeight;
    }, [isLoading]);

    useEffect(() => {
        const chatInput = document.querySelector('.chat-input-field>textarea');
        const chatBox = document.querySelector('.chat-list');
        const scrollDownBtn = document.querySelector('.btn-scrolldown');

        chatInput.addEventListener('input', (e) => {
            if (e.target.scrollHeight / 22 < 7) {
                chatInput.style.height = 'auto';
                let scrollHeight = e.target.scrollHeight - 20;
                chatInput.style.height = `${scrollHeight}px`;
            }
            chatInput.scrollTop = e.target.scrollHeight - 20;
        })

        chatBox.addEventListener('scroll', (e) => {
            chatBox.scrollTop < chatBox.scrollHeight - chatBox.offsetHeight - 100
                ? scrollDownBtn.style.transform = 'translate(-50%, -250%)'
                : scrollDownBtn.style.transform = 'translate(-50%, -50%)'
        })

    }, []);

    const scrollToBottom = () => {
        document.querySelector('.chat-list').scrollTo({
            top: document.querySelector('.chat-list').scrollHeight,
            behavior: 'smooth'
        })
    };

    const ChatInput = memo(() => {
        const [message, setMessage] = useState('');
        const sendMessage = (e) => {
            if (e.keyCode === 13 && e.shiftKey === false) {
                if (message.trim() !== '') {
                    const data = {
                        roomID: id,
                        content: message
                    }
                    socket.emit('sendMessage', data)
                    setMessage('')
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
                    value={message} />
            </div>
        )
    })

    return (
        <div className="chat-wrap">
            <div className='chatbox-details'>
                <div className='chatbox-details-backbtn'><Link to='/'><FontAwesomeIcon icon={faArrowLeft} /></Link></div>
                <div className='md-avatar'><img src={avatar} className='avatar' alt='' /></div>
                {roomDetails.length > 0 && <div className='chatbox-details-name'>{roomDetails[0].members[0].username}</div>}
            </div>
            <div className='chat-list'>
                {isLoading ? <div>loading</div> : chatHistory.map((item, i) => {
                    let sender;
                    const timeOptions = {
                        lastDay: 'dd LT',
                        sameDay: 'LT',
                        nextDay: 'dd LT',
                        lastWeek: 'dd LT',
                        nextWeek: 'dd LT',
                        sameElse: 'LT[,] D MMMM, YYYY'
                    };
                    const time = moment(item.createdAt).calendar(timeOptions);
                    const prevTime = i > 0 ? moment(chatHistory[i - 1].createdAt) : ''
                    let timeDiff = moment(item.createdAt).diff(prevTime, 'minutes') < 17;
                    if (item.sender) {
                        sender = JSON.parse(item.sender)
                    }
                    else {
                        userID === item.authorID ? sender = true : sender = false
                    }
                    return (
                        <Fragment key={i}>
                            {!timeDiff && <div className='time-send'>{time}</div>}
                            <ChatLine username={item.authorName.username}
                                avatar={avatar}
                                content={item.content}
                                sender={sender}
                                time={time} />
                        </Fragment>
                    )
                })}
            </div>
            <button onClick={scrollToBottom} className='btn-scrolldown'><FontAwesomeIcon icon={faArrowDown} /></button>
            <ChatInput />
        </div>
    );
}

export default ChatBox;