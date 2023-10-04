import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaPlus } from 'react-icons/fa';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import api, { formatAlreadyDate } from '../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import getUsers, { User, getSessionUser } from '../utils/GetUser';
import './TasksPage.css';
import TaskCard from '../components/tasks/TaskCard';
import { Task } from '../components/tasks/TaskUtils';
import FilterSelect from '../components/custom/filterSelect';

const TasksPage: React.FC = () => {
  const [filterCriteria, setFilterCriteria] = useState<number[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sessionUser, setSessionUser] = useState<User | null>();
  const [updateCounter, setUpdateCounter] = useState<number>(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchTasksAndUsers();
  }, [updateCounter]);

  useEffect(() => {
    const filtered = filterCriteria.length > 0 ? tasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterCriteria.includes(task.staff) || filterCriteria.find(crit => task.assignee == crit))
    ) : tasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()));

    setFilteredTasks(filtered);
  }, [searchQuery, tasks, filterCriteria]);

  const handleFilterSelect = (criteria: number[] | null) => {
    if (criteria && criteria.length >= 0) {
      setFilterCriteria(criteria);
    }
  };

  const fetchTasksAndUsers = async () => {
    try {
      const [tasksResponse, usersResponse, sessionResponse] = await Promise.all([
        api('/get/tasks'),
        getUsers(),
        getSessionUser(),
      ]);

      setTasks(tasksResponse.data.map((task: Task) => ({
        ...task,
        comments: [],
      })));

      if (usersResponse) setUsers(usersResponse);
      if (sessionResponse) setSessionUser(sessionResponse);
      setIsLoadingTasks(false);
    } catch (error) {
      console.error('Erro ao requisitar dados:', error);
      setIsLoadingTasks(false);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setFilterCriteria([]);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    if (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) return;

    const updatedTasks = Array.from(tasks);
    const movedTaskIndex = updatedTasks.findIndex((task) => task.id === parseInt(result.draggableId));
    const [movedTask] = updatedTasks.splice(movedTaskIndex, 1);
    updatedTasks.splice(result.destination.index, 0, movedTask);
    const updatedTask = {
      ...movedTask,
      status: result.destination.droppableId as number,
      assignee: result.destination.droppableId === '0' ? null : sessionUser?.id as number,
      due_date: formatAlreadyDate(movedTask.due_date),
    };

    try {
      const loadingSwal = withReactContent(Swal);
      loadingSwal.fire({
        title: 'Atualizando...',
        allowOutsideClick: false,
        didOpen: () => {
          loadingSwal.showLoading();
        },
      });

      await api.put(`/edit/task/${updatedTask.id}`, updatedTask);
      await fetchTasksAndUsers();

      loadingSwal.close();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const renderStatusColumn = (status: number) => (
    <Droppable key={status} droppableId={status.toString()}>
      {(provided) => (
        <td
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="status-column status-c p-3"
        >
          {filteredTasks
            .filter((task) => task.status === status)
            .map((task, index) => (
              <Draggable
                disableInteractiveElementBlocking={true}
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard sessionUser={sessionUser} task={task} users={users} updateCounter={updateCounter} setUpdateCounter={setUpdateCounter} />
                  </div>
                )}
              </Draggable>
            ))}
          {provided.placeholder}
        </td>
      )}
    </Droppable>
  );

  const renderTasksTable = () => {
    if (isLoadingTasks) {
      return <div className="text-center">Carregando tarefas...</div>;
    }

    return (
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Pendente</th>
              <th>Em andamento</th>
              <th>Finalizada</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {renderStatusColumn(0)}
              {renderStatusColumn(1)}
              {renderStatusColumn(2)}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container">
      <h2>Tarefas</h2>
      <input
        type="text"
        placeholder="Buscar tarefa"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-control"
      />

      {sessionUser && parseInt(sessionUser.group) >= 5 ? (
        <Link to="/register/task" className="btn btn-primary mt-3 custombtn">
          <FaPlus /> Criar Tarefa
        </Link>
      ) : null}
      <button className='btn btn-warning mt-3 custombtn' onClick={togglePopup}> <FaFilter color='black' /> Filtro por usuário</button>

      {showPopup && (
        <div className='mt-3'><FilterSelect onSelectFilter={handleFilterSelect} /></div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        {renderTasksTable()}
      </DragDropContext>
    </div>
  );
};

export default TasksPage;
