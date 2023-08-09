import { Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes, ProtectRoutes, AuthRoutes } from './routes/index';
import HomePage from './pages/home';
import './App.css'
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    if (localStorage.getItem('theme')) {
      document.body.classList.add('dark');
    }
  }, []);

  return (
    <Routes>
      <Route element={<AuthRoutes />}>
        {publicRoutes.map((route, i) => {
          const Page = route.element;
          return (
            <Route key={i} path={route.path} element={<Page />} />
          )
        })}
      </Route>
      <Route element={<ProtectRoutes />}>
        <Route path='/' element={<HomePage />}>
          {privateRoutes.map((route, i) => {
            const Page = route.element;
            return (
              <Route key={i} path={route.path} element={<Page />} />
            )
          })}
        </Route>
      </Route>
    </Routes>
  )
}

export default App;
