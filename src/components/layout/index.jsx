import { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faArrowRightFromBracket, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from '../../context/socket';
import avatar from '../../assets/images/avatar.jpg';
import './layout.css';

function Layout() {

    const [subMenu, setSubMenu] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [userList, setUserList] = useState([]);

    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    function FindRoom(id) {
        axios.get(`/room-exist/${id}`, { withCredentials: true })
            .then(res => {
                navigate(`/m/${res.data._id}`)
            })
            .catch(() => alert('Có lỗi xảy ra'))
    }

    function LogOut() {
        axios.get('https://nice-chat-app.fly.dev/auth/logout', { withCredentials: true })
            .then(() => {
                socket.disconnect();
                Cookies.remove('login');
                navigate('/login')
            })
            .catch(() => alert('Có lỗi xảy ra'))
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

    function ToggleSubMenu() {
        subMenu ? setSubMenu(false) : setSubMenu(true)
    }

    return (
        <nav className="app-wrap">
            <div className="side-menu">
                <div className="lg-avatar"><img src={avatar} className="avatar" /></div>
                <div className="menu-action"><button type="button" onClick={ToggleSubMenu}><FontAwesomeIcon icon={faMagnifyingGlass} /></button></div>
                <div className="menu-action"><a href="#"><FontAwesomeIcon icon={faGear} /></a></div>
                <div className="menu-action"><button onClick={LogOut}><FontAwesomeIcon icon={faArrowRightFromBracket} /></button></div>
                {subMenu && <div className="sub-menu">
                    <div className="search-field">
                        <input placeholder="Find user..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
                        {/* <button type="button">search user</button> */}
                    </div>
                    <div className="result-field">
                        {userList.map(user => {
                            console.log(user)
                            return (
                                <button onClick={() => FindRoom(user._id)} className="search-user-details" key={user._id}>
                                    <div className="md-avatar"><img src={avatar} className="avatar" /></div>
                                    <div>{user.username}</div>
                                </button>
                            )
                        })}
                    </div>
                </div>}
            </div>
            <Outlet />
        </nav>
    );
}

export default Layout;