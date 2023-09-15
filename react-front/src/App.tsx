import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import UsersPage from './pages/UsersPage'; 
import UserFormPage from './pages/UserFormPage'; 
import TasksPage from './pages/TasksPage'; 
import TaskFormPage from './pages/TaskFormPage'; 
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import api from './api';
import Swal from 'sweetalert2';
import LogOut from './components/LogOut';
import TaskRegister from './components/RegisterTask';
import { User } from './utils/GetUser';

const App: React.FC = () => {
  const logged_user: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
    group: '',
    username: '',
    image: ''
  }
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loggedUser, setLoggedUser] = useState<User>(logged_user);
  const location = useLocation();
  useEffect(() => {
    const checkAuth = async () => {

      if (sessionStorage.getItem('token')) {
        Swal.showLoading();

        api.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;

        api('/logged')
          .then((rp) => {
            const data = rp.data;
            if (data.auth) setIsAuthenticated(true);

            setLoggedUser({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              password: data.user.senha,
              group: data.user.group,
              username: data.user.username,
              image: data.user.image,
            })
          })
          .catch((error) => {
            console.log("Erro ao buscar dados da sessão", error)
          })
          .finally(() => {
            Swal.close();
          });
          
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  return (
    <div>
        <Navbar auth={isAuthenticated} loggedUser={loggedUser}/>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home/> : <Navigate to="/login" />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login setAuth={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          {isAuthenticated ? (
            <>
              <Route path="/register/task" element={parseInt(loggedUser.group) >= 10 ? <TaskRegister /> : <Navigate to={'/'}/>} />
              <Route path="/edit/users/:id" element={parseInt(loggedUser.group) >= 10 ? <UserFormPage /> : <Navigate to={'/'}/>} />
              <Route path="/edit/tasks/:id" element={<TaskFormPage /> } />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/logout" element={<LogOut />} />
              <Route path="/tasks" element={<TasksPage />} />
            </>
          ) : (
            <Route element={<Navigate to="/" />} />
          )}
        </Routes>
    </div>
  );
};

export default App;
