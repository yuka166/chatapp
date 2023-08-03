import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function RegisterPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    useEffect(() => {
        const showPassBtn = document.querySelectorAll('.showpass-btn')
        const inputField = document.querySelectorAll('input[type="password"]');
        showPassBtn.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('showpass-btn-active');
                if (inputField[i].getAttribute('type') === 'password') {
                    inputField[i].setAttribute('type', 'text');
                }
                else {
                    inputField[i].setAttribute('type', 'password');
                }
            });
        });
    }, []);

    function Register() {
        if (username.trim() === '') {
            document.getElementById('username').classList.add('invalid-input')
        }

        if (email.trim() === '') {
            document.getElementById('email').classList.add('invalid-input')
        }

        if (password.trim() === '') {
            document.getElementById('password').classList.add('invalid-input')
        }

        if (rePassword.trim() === '') {
            document.getElementById('re-password').classList.add('invalid-input')
        }

        if (username.trim() !== '' && email.trim() !== ''
            && /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/.test(email.trim())
            && password.trim() !== '' && password === rePassword) {
            axios.post('https://nice-chat-app.fly.dev/auth/register',
                {
                    username: username,
                    email: email,
                    password: password
                }, { withCredentials: true })
                .then(() => {
                    alert('Đăng ký thành công!');
                    navigate('/login');
                })
                .catch((e) => {
                    if (e.response.data.error.code === 11000) {
                        alert('Tên đăng nhập đã được sử dụng!');
                    }
                    else {
                        alert('Có lỗi xảy ra!');
                    }
                })
        }
    }

    const onEnterPress = (e) => {
        if (e.keyCode == 13) {
            Register();
        }
    };

    function checkPassword(e, text) {
        const repass = document.getElementById('re-password');
        if (e.target.value !== text) {
            repass.classList.add('invalid-input')
        }
        else {
            repass.classList.remove('invalid-input')
        }
    }

    return (
        <div className='authform-wrap'>
            <div className='title'>Signup</div>
            <form>
                <div className='input-field'>
                    <input type='text' name='username' id='username'
                        value={[username]} onChange={e => {
                            setUsername(e.target.value)
                            e.target.classList.remove('invalid-input')
                        }} onKeyDown={onEnterPress} required />
                    <label htmlFor="username">Username</label>
                </div>
                <div className='input-field'>
                    <input type='email' name='email' id='email' pattern='[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$'
                        value={[email]} onChange={e => {
                            setEmail(e.target.value)
                            e.target.classList.remove('invalid-input')
                        }} onKeyDown={onEnterPress} required />
                    <label htmlFor="email">Email</label>
                </div>
                <div className='input-field'>
                    <input type='password' name='password' id='password' className='password'
                        value={[password]} onChange={e => {
                            checkPassword(e, rePassword);
                            setPassword(e.target.value);
                            e.target.classList.remove('invalid-input')
                        }} onKeyDown={onEnterPress} required />
                    <label htmlFor="password">Password</label>
                    <button type='button' className='showpass-btn'>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                </div>
                <div className='input-field'>
                    <input type='password' name='re-password' id='re-password' className='password'
                        value={[rePassword]} onChange={e => {
                            checkPassword(e, password);
                            setRePassword(e.target.value);
                        }} onKeyDown={onEnterPress} required />
                    <label htmlFor="re-password">Confirm Password</label>
                    <button type='button' className='showpass-btn'>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                </div>
                <div>
                    <button type='button' onClick={Register} className='submit-btn'>Sign up</button>
                </div>
            </form>
            <div>Already a member? <Link to='/login'>Login</Link></div>
        </div>
    );
}

export default RegisterPage;
