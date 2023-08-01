import { Navigate, Outlet } from 'react-router-dom';
import HomePage from '../pages/home';
import LoginPage from "../pages/login";
import RegisterPage from '../pages/register';
import Layout from '../components/layout';
import ChatBox from '../components/chatbox';

const publicRoutes = [
    { path: '/login', element: LoginPage },
    { path: '/register', element: RegisterPage }
];

const privateRoutes = [
    { path: '/m/:id', element: ChatBox },
]

const ProtectRoutes = () => {
    return document.cookie.valueOf('logged') ? <Layout /> : <Navigate to='/login' />
}

const AuthRoutes = () => {
    return !document.cookie.valueOf('logged') ? <Outlet /> : <Navigate to='/' replace='true' />
}

export { publicRoutes, privateRoutes, ProtectRoutes, AuthRoutes };