import { useState, useEffect, useContext, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import { SocketContext } from '../../context/socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ChatLine from '../chatline';
import ChatInput from './chatInput';
import { ChatSkeleton } from '../ui/skeleton';
import avatar from '../../assets/images/avatar.jpg';
import './chatbox.css';

function ChatBox() {

    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);
    const [roomDetails, setRoomDetails] = useState([]);
    const { socket, userID } = useContext(SocketContext);

    let multiChat = [];

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
        const chatBox = document.querySelector('.chat-list');
        if (chatBox.scrollTop > chatBox.scrollHeight - chatBox.offsetHeight - 200
            || chatHistory[chatHistory.length - 1].authorID === userID) {
            scrollToBottom();
        }
    }, [chatHistory]);

    useEffect(() => {
        document.querySelector('.chat-list').scrollTop = document.querySelector('.chat-list').scrollHeight;
    }, [isLoading]);

    useEffect(() => {
        const chatBox = document.querySelector('.chat-list');
        const scrollDownBtn = document.querySelector('.btn-scrolldown');

        chatBox.addEventListener('scroll', (e) => {
            chatBox.scrollTop < chatBox.scrollHeight - chatBox.offsetHeight - 100
                ? scrollDownBtn.style.transform = 'translate(-50%, -250%)'
                : scrollDownBtn.style.transform = 'translate(-50%, -50%)'
        })

        window.addEventListener('resize', () => {
            scrollToBottom();
        })

    }, []);

    const scrollToBottom = () => {
        document.querySelector('.chat-list').scrollTo({
            top: document.querySelector('.chat-list').scrollHeight,
            behavior: 'smooth'
        })
    };

    return (
        <div className="chat-wrap">
            <div className='chatbox-details'>
                <div className='chatbox-details-backbtn'><Link to='/'><FontAwesomeIcon icon={faArrowLeft} /></Link></div>
                <div className='md-avatar'><img src={avatar} className='avatar' alt='' /></div>
                {roomDetails.length > 0 && <div className='chatbox-details-name'>
                    {roomDetails[0].members[0].displayname !== null
                        ? roomDetails[0].members[0].displayname
                        : roomDetails[0].members[0].username}</div>}
            </div>
            <div className='chat-list'>
                {isLoading
                    ? <>
                        <ChatSkeleton position={'r-chat'} line={2} />
                        <ChatSkeleton position={'l-chat'} line={4} />
                        <ChatSkeleton position={'r-chat'} line={1} />
                    </>
                    : chatHistory.map((item, i) => {
                        let sender;

                        const timeOptions = {
                            lastDay: 'dd LT',
                            sameDay: 'LT',
                            nextDay: 'dd LT',
                            lastWeek: 'dd LT',
                            nextWeek: 'dd LT',
                            sameElse: 'LT[,] D MMMM, YYYY'
                        },
                            time = moment(item.createdAt).calendar(timeOptions),
                            prevTime = i > 0 ? moment(chatHistory[i - 1].createdAt) : '';
                        let timeDiff = moment(item.createdAt).diff(prevTime, 'minutes') < 17;

                        // console.log(moment(item.createdAt).diff(prevTime, 'second'))

                        if (item.sender) {
                            sender = JSON.parse(item.sender)
                        }
                        else {
                            userID === item.authorID ? sender = true : sender = false
                        }

                        // console.log(item.authorID + ', ' + (chatHistory[i + 1] && chatHistory[i + 1].authorID))
                        if (item.authorID === (chatHistory[i - 1] && chatHistory[i - 1].authorID)
                            && moment(item.createdAt).diff(prevTime, 'second') < 61) {
                            multiChat.push(item.content)
                        }
                        else {
                            multiChat = [item.content];
                            return (
                                <Fragment key={i}>
                                    {!timeDiff && <div className='time-send'>{time}</div>}
                                    <ChatLine username={item.authorName.username}
                                        avatar={avatar}
                                        content={multiChat}
                                        sender={sender}
                                        time={time} />
                                </Fragment>
                            )
                        }
                    })}
            </div>
            <button onClick={scrollToBottom} className='btn-scrolldown'><FontAwesomeIcon icon={faArrowDown} /></button>
            <ChatInput />
        </div>
    );
}

export default ChatBox;