import { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faArrowRightFromBracket, faMagnifyingGlass, faLightbulb, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from '../../context/socket';
import avatar from '../../assets/images/avatar.jpg';
import './layout.css';

function Layout() {

    const [findUsersMenu, setFindUsersMenu] = useState(false);
    const [userInfoMenu, setUserInfoMenu] = useState(false);
    const [userInfo, setUserInfo] = useState([]);

    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('sendRoom', data => {
            socket.emit('joinRoom', data._id);
        })
        socket.on('gotoBox', data => {
            setFindUsersMenu(false);
            navigate(`/m/${data._id}`);
        })
        socket.on('getId', id => {
            axios.get('https://nice-chat-app.fly.dev/user/' + id, { withCredentials: true })
                .then(res => setUserInfo(res.data))
                .catch(e => console.log(e))
        });
    }, []);

    function LogOut() {
        axios.get('https://nice-chat-app.fly.dev/auth/logout', { withCredentials: true })
            .then(() => {
                socket.disconnect();
                Cookies.remove('login');
                navigate('/login')
            })
            .catch(() => alert('Có lỗi xảy ra'))
    }

    function ChangeBgColor() {
        if (localStorage.getItem('theme')) {
            localStorage.removeItem('theme');
            document.body.classList.remove('dark');
        }
        else {
            localStorage.setItem('theme', 'dark');
            document.body.classList.add('dark');
        }
    }

    function ToggleFindUsersMenu() {
        findUsersMenu ? setFindUsersMenu(false) : setFindUsersMenu(true)
        setUserInfoMenu(false)
    }

    function ToggleUserInfoMenu() {
        userInfoMenu ? setUserInfoMenu(false) : setUserInfoMenu(true)
        setFindUsersMenu(false)
    }

    function CloseSubMenu() {
        if (userInfoMenu) {
            setUserInfoMenu(false)
        }
        if (findUsersMenu) {
            setFindUsersMenu(false)
        }
    }

    function FindUsersMenu() {

        const [searchInput, setSearchInput] = useState('');
        const [userList, setUserList] = useState([]);

        function FindRoom(id) {
            socket.emit('createRoom', id);
        }

        useEffect(() => {
            if (searchInput.trim().length > 0) {
                axios.get('https://nice-chat-app.fly.dev/users/' + searchInput.trim(), { withCredentials: true })
                    .then(res => setUserList(res.data))
                    .catch(e => console.log(e))
            }
            else {
                setUserList([])
            }
        }, [searchInput]);
        return (
            <div className="sub-menu">
                <div className="search-field">
                    <input placeholder="Find user..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
                </div>
                <div className="result-field">
                    {userList.map(user => {
                        return (
                            <button onClick={() => FindRoom(user._id)} className="search-user-details" key={user._id}>
                                <div className="md-avatar"><img src={avatar} className="avatar" /></div>
                                <div>{user.username}</div>
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    function UserInfoMenu() {
        const [displayName, setDisplayName] = useState([]);
        useEffect(() => {
            userInfo.displayname !== null ? setDisplayName(userInfo.displayname) : setDisplayName("Chưa đặt")
        }, []);
        function ModifyDisplayName() {
            axios.put('https://nice-chat-app.fly.dev/user/modify', {
                displayname: displayName
            }, { withCredentials: true })
                .then(() => {
                    alert('Cập nhật thành công!');
                })
                .catch((e) => {
                    alert('Có lỗi xảy ra...')
                    console.log(e)
                })
        }
        return (
            <div className="sub-menu">
                <div className="close-btn" onClick={CloseSubMenu}>
                    <button type="button"><FontAwesomeIcon icon={faXmark} /></button>
                </div>
                <div className="center xlg-avatar"><img src={avatar} className="avatar" /></div>
                <div className="center">@{userInfo.username}</div>
                <form>
                    <div>Tên hiển thị: <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
                    <div>Email: {userInfo.email}</div>
                    <div className="update-btn"><button type="button" onClick={ModifyDisplayName}>Cập nhật</button></div>
                </form >
            </div >
        )
    }

    return (
        <nav className="app-wrap">
            <div className="side-menu">
                <div className="lg-avatar"><button type="button" onClick={ToggleUserInfoMenu}><img src={avatar} className="avatar" /></button></div>
                <div className="menu-action"><button type="button" onClick={ToggleFindUsersMenu}><FontAwesomeIcon icon={faMagnifyingGlass} /></button></div>
                <div className="menu-action"><a href="#"><FontAwesomeIcon icon={faGear} /></a></div>
                <div className="menu-action"><button onClick={LogOut}><FontAwesomeIcon icon={faArrowRightFromBracket} /></button></div>
                <div className="menu-action"><button onClick={ChangeBgColor}><FontAwesomeIcon icon={faLightbulb} /></button></div>
                {findUsersMenu && <FindUsersMenu />}
                {userInfoMenu && <UserInfoMenu />}
            </div>
            <Outlet />
        </nav>
    );
}

export default Layout;
