import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { formatDateForBackend } from '../api';
import Swal from 'sweetalert2';
import './TaskFormPage.css';
import DateInput from '../components/custom/DateInput';
import PrioritySelect from '../components/custom/PrioritySelect';
import ProjectSelect from '../components/custom/ProjectSelect';
import TextEditor from '../components/custom/TextEditor';
import { Task } from '../components/tasks/TaskUtils';

const TaskFormPage: React.FC = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [task, setTask] = useState<Task>({
    id: 0,
    name: '',
    description: 'Carregando...',
    staff: 0,
    due_date: null,
    priority: 0,
    status: 0,
    assignee: 1,
    comments: [],
  });

  useEffect(() => {
    const fetchTask = async () => {
        Swal.showLoading();
        api.get(`/get/tasks/${id}`)
        .then((rp: any) => {
          setTask(rp.data);
          
        }).catch(() => {
          history('/register/task');
        })
        .finally(() => {
          Swal.close();
          setLoaded(true);
        });
    };
    if (id) fetchTask();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    task.due_date = task.due_date ? formatDateForBackend(task.due_date) : null;

    if(task.due_date == 'NaN-NaN-NaN') task.due_date = null;

    try {
      Swal.showLoading();
      await api.put(`http://127.0.0.1:8000/api/edit/task/${id}`, task);
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Tarefa salva com sucesso.',
      });
      history('/tasks');
    } catch (error) {}
  };

  return (
    loaded ?
    <div className="container">
      <h2>{id ? 'Editar tarefa' : 'Adicionar tarefa'}</h2>
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
          <TextEditor initialText={task.description} onChange={(text) => setTask({...task, description: text})} cancellable={false} saveable={false} editable={true} />
        </div> 
        <div className="mb-3">
          <label className="form-label">Data de Vencimento:</label>
          <br />
          <DateInput
            value={task.due_date ?? ''}
            onChange={(date: string) => setTask({...task, due_date: date})}
          />
        </div>
        <div className="mb-3">
          <PrioritySelect
            selected={task.priority}
            onChange={(value: number) => {setTask({ ...task, priority: value })}}
          />
        </div>
        <div className="mb-3">
          <ProjectSelect
            selected={task.staff}
            onChange={(value: number) => {setTask({ ...task, staff: value })}}
            apiUrl='/get/users'
            attributeLabel="name"
            name='Selecione o administrador'
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </form>
    </div>
  :  (<div className="overlay"><div className="loading"><div className="loading-spinner"></div></div></div>));
};

export default TaskFormPage;
