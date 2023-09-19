import React, { useState, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { formatDateForBackend } from '../api';
import Swal from 'sweetalert2';
import { getSessionUser, User } from '../utils/GetUser';
import DateInput from './custom/DateInput';
import ProjectSelect from './custom/ProjectSelect';
import PrioritySelect from './custom/PrioritySelect';
import { Task } from './tasks/TaskUtils';
import TextEditor from './custom/TextEditor';



const TaskRegister: React.FC = () => {
  const history = useNavigate();
  const [task, setTask] = useState<Task>({
    id: 0,
    name: '',
    description: '',
    staff: 0,
    due_date: null,
    priority: 0,
    status: 0,
    assignee: null,
    comments: [],
  });
  const [sessionUser, setSessionUser] = useState<User | undefined>();

  useEffect(() => {
    const fetchSessionUser = async () => {
      try {
        const session = await getSessionUser();
        if (session) {
          setSessionUser(session);
          setTask((prevTask) => ({
            ...prevTask,
            staff: session.id,
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar dados da sessão:', error);
      }
    };

    fetchSessionUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        
    task.due_date = task.due_date ? formatDateForBackend(task.due_date) : null;

    if(task.due_date == 'NaN-NaN-NaN') task.due_date = null;

      Swal.showLoading();

      api.post('http://127.0.0.1:8000/api/register/task', task)
      .then(() => {
        Swal.hideLoading();
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Tarefa registrada com sucesso.',
        });
        history('/tasks');
      }).catch(() => {
        Swal.hideLoading();
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Erro ao registrar tarefa.',
        });
      });

  };

  return (
    <div className="container">
      <h2>Adicionar tarefa</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome:</label>
          <input
            type="text"
            className="form-control"
            value={task.name}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descrição:</label>
          <TextEditor initialText={''} onChange={(text) => setTask({ ...task, description: text})} cancellable={false} saveable={false} editable={true}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Data de Vencimento:</label>
          <br />  
          <DateInput
            value={task.due_date ? task.due_date : ''}
            onChange={(date: string) => setTask({ ...task, due_date: date })}
          />
        </div>
        <div className="mb-3">
          <PrioritySelect
            onChange={(priority: number) => setTask({ ...task, priority: priority })}
          />
        </div>
        {sessionUser ? (
          <div className="mb-3">
            <ProjectSelect
              selected={task.staff}
              onChange={(value: number) =>
                setTask({ ...task, staff: value })
              }
              apiUrl={'/get/users'}
              attributeLabel="name"
              name={'Selecione o administrador'}
            />
          </div>
        ) : null}
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default TaskRegister;