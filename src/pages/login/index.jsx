import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function LoginPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function Login() {
        if (username.trim() === '') {
            document.getElementById('username').classList.add('invalid-input')
        }

        if (password.trim() === '') {
            document.getElementById('password').classList.add('invalid-input')
        }

        if (username.trim() !== '' && password.trim() !== '') {
            axios.post('https://nice-chat-app.fly.dev/auth/login',
                {
                    username: username,
                    password: password,
                    staySignIn: document.querySelector('#staylogged').checked
                }, { withCredentials: true })
                .then(() => {
                    alert('Đăng nhập thành công!');
                    document.querySelector('#staylogged').checked
                        ? Cookies.set('login', true, { expires: 7 })
                        : Cookies.set('login', true)
                    navigate('/');
                })
                .catch(() => alert('Sai tên đăng nhập hoặc mật khẩu'))
        }
    }

    const onEnterPress = (e) => {
        if (e.keyCode == 13) {
            Login();
        }
    };

    useEffect(() => {
        const showPassBtn = document.querySelector('.showpass-btn');
        const inputField = document.querySelector('#password');
        showPassBtn.addEventListener('click', () => {
            showPassBtn.classList.toggle('showpass-btn-active');
            if (inputField.getAttribute('type') === 'password') {
                inputField.setAttribute('type', 'text');
            }
            else {
                inputField.setAttribute('type', 'password');
            }
        });
    }, []);

    return (
        <div className='authform-wrap'>
            <div className='title'>Login</div>
            <div>
                <form>
                    <div className='input-field'>
                        <input type='text' name='username' id='username' value={username}
                            onChange={e => {
                                setUsername(e.target.value)
                                e.target.classList.remove('invalid-input')
                            }} onKeyDown={onEnterPress} required />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className='input-field'>
                        <input type='password' name='password' id='password' value={password}
                            onChange={e => {
                                setPassword(e.target.value)
                                e.target.classList.remove('invalid-input')
                            }} onKeyDown={onEnterPress} className='password' required />
                        <label htmlFor="password">Password</label>
                        <button type='button' className='showpass-btn'>
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                    </div>
                    <div className='checkbox-field'>
                        <input type='checkbox' name='staylogged' id='staylogged' />
                        <label htmlFor="staylogged">Remember me</label>
                    </div>
                    <div>
                        <button type='button' onClick={Login} className='submit-btn'>Log in</button>
                    </div>
                </form>
            </div>
            <div>Not a member? <Link to='/register'>Signup</Link></div>
        </div>
    );
}

export default LoginPage;
