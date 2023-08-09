import './skeleton.css';

function UserSkeleton() {
    return (
        <div className='loading friend-chat'>
            <div className='friend-chat-avatar lg-avatar'></div>
            <div className="friend-chat-details">
                <div className='friend-chat-name'></div>
                <div className='friend-chat-latest'></div>
            </div>
        </div>
    )
}

function ChatSkeleton({ position, line }) {
    const Lines = () => {
        let n = [];
        for (let i = 0; i < line; i++) {
            n.push(<div className='chat-wrap-content multi-line'></div>)
        }
        return n;
    }
    return (
        <div className={`${position} loading`}>
            <div className="chat-wrap-details">
                <div className='chat-wrap-avatar sm-avatar'></div>
                {line > 1
                    ? <div className='multi-line-wrap'>
                        <Lines />
                    </div>
                    : <div className='chat-wrap-content'></div>}
            </div>
        </div>
    )
}

export { UserSkeleton, ChatSkeleton };