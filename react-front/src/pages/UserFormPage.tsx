import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';
import GroupSelect from '../components/custom/GroupSelect';
import { User } from '../utils/GetUser';

const UserFormPage: React.FC = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [user, setUser] = useState<User>({
    id: 0,
    username: '',
    name: '',
    email: '',
    group: '1',
    image: '',
    password: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      Swal.showLoading();
      api(`/get/users/${id}`)
        .then((rp) => {
          Swal.close();
          setUser(rp.data);
        });
    };
    if (id) fetchUser();
  }, [id]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        Swal.showLoading();
        await api.put(`http://127.0.0.1:8000/api/edit/user/${id}`, user);
        Swal.close();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Erro ao processar os dados do formulário.',
        });
      }
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Usuário salvo com sucesso.',
      });
      history('/users');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Erro ao salvar usuário.',
      });
    }
  };

  return (
    <div className="container">
      <h2>{id ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={user.username}
            onChange={(e) => handleFieldChange('username', e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={user.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={user.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={user.password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
          />
        </div>
        <div className="mb-3">
          <GroupSelect selected={user.group} onChange={(value: string) => handleFieldChange('group', value)} />
        </div>
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default UserFormPage;
