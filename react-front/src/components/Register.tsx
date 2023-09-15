import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';

const Register: React.FC = () => {
  Swal.close();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [name, setName] = useState('');
  let navigate = useNavigate();

  const handleRegister = async () => {
      Swal.showLoading();
      api.post('/register', { username, email, password, password_confirmation, name, group: '1'})
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Cadastro feito com sucesso.',
        });
      })
      .catch(() => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Erro ao cadastrar usuário.',
        });
      })
      .finally(() => {
        let token = sessionStorage.getItem('token');
        Swal.close();
        if(!!token) {
          navigate('/users');
        } else {
          navigate('/');
        }
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-header">Register</div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Nome
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password_confirmation" className="form-label">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password_confirmation"
                  value={password_confirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
              </div>

              <button className="btn btn-primary" onClick={handleRegister}>
                Cadastrar
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;