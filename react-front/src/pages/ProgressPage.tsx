import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import api from '../api';
import './ProgressPage.css';
import { Progress, calculateSumOfHoursAndMinutesForDay } from '../components/progress/ProgressUtils';
import ProgressCard from '../components/progress/ProgressCard';
import { Task } from '../components/tasks/TaskUtils';
import TaskCard from '../components/tasks/TaskCard';
import getUsers, { User, getSessionUser } from '../utils/GetUser';
import 'react-datepicker/dist/react-datepicker.css';
import AddProgressModal from '../components/progress/AddProgressModal';
import Swal from 'sweetalert2';

const ProgressPage: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [selectedWeek, setSelectedWeek] = useState<string[]>();
  const [filteredProgresses, setFilteredProgresses] = useState<Progress[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [progresses, setProgresses] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchProgressQuery, setSearchProgressQuery] = useState<string>('');
  const [searchTaskQuery, setSearchTaskQuery] = useState<string>('');
  const [sessionUser, setSessionUser] = useState<User | null>();
  const [updateCounter, setUpdateCounter] = useState<number>(0);
  const [draggedTask, setDraggedTask] = useState<Task | undefined>();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedWeekStartDate, setSelectedWeekStartDate] = useState<string>('');
  const [selectedWeekEndDate, setSelectedWeekEndDate] = useState<string>('');

  useEffect(() => {
    fetchProgressAndUsers();
    calculateWeekDays(currentWeek);
  }, [currentWeek, updateCounter]);

  useEffect(() => {
    if (selectedWeek && selectedWeek.length > 0) {
      setSelectedWeekStartDate(selectedWeek[0]);
      setSelectedWeekEndDate(selectedWeek[4]);
    }
  }, [selectedWeek]);

  useEffect(() => {
    setFilteredTasks(
      tasks.filter((task) =>
        task.name.toLowerCase().includes(searchTaskQuery.toLowerCase())
      )
    );
  }, [searchTaskQuery, tasks]);

  useEffect(() => {
    setFilteredProgresses(
      progresses.filter((progress) =>
        progress.description.toLowerCase().includes(searchProgressQuery.toLowerCase()) && progress.user_id == sessionUser?.id
      )
    );
  }, [searchProgressQuery, progresses]);

  const calculateWeekDays = (weekOffset: number) => {
    const today = new Date();
    today.setDate(today.getDate() + weekOffset * 7);
    const currentDay = today.getDay();
    const days = [];

    for (let i = 2; i <= 6; i++) {
      const daysToSubtract = currentDay === 0 ? 7 - i : currentDay - i;
      const date = new Date(today);
      date.setDate(today.getDate() - daysToSubtract);
      days.push(date.toISOString().split('T')[0]);
    }

    setSelectedWeek(days);
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(currentWeek - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeek(currentWeek + 1);
  };

  const handleActualWeek = () => {
    setCurrentWeek(0);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    if (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) return;

    const updatedProgresses = Array.from(filteredProgresses);
    const movedProgressIndex = updatedProgresses.findIndex((progress) => progress.id === parseInt(result.draggableId));
    const [movedProgress] = updatedProgresses.splice(movedProgressIndex, 1);
    updatedProgresses.splice(result.destination.index, 0, movedProgress);

    const taskId = parseInt(result.draggableId.split('-')[1]);
    const selectedTask = tasks.find((task) => task.id === taskId);
    setModalOpen(true);
    setDraggedTask(selectedTask);
    setSelectedDate(result.destination.droppableId);
  };

  const fetchProgressAndUsers = async () => {
    setIsLoading(true);
    try {
      const [progressResponse, tasksResponse, usersResponse, sessionUserResponse] = await Promise.all([
        api.get('/get/progress'),
        api.get('/get/tasks'),
        getUsers(),
        getSessionUser(),
      ]);

      const progressWithDayOfWeek = progressResponse.data.map((progress: Progress) => ({
        ...progress,
        dayOfWeek: calculateDayOfWeek(progress.date),
      }));

      const tasksResponseF = tasksResponse.data.map((task: Task) => ({
        ...task,
      }));

      setTasks(tasksResponseF);
      setProgresses(progressWithDayOfWeek);
      setFilteredProgresses(progressWithDayOfWeek);
      if (usersResponse) setUsers(usersResponse);
      if (sessionUserResponse) setSessionUser(sessionUserResponse);
    } catch (error) {
      console.error('Erro ao requisitar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDayOfWeek = (dateTime: string) => {
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const date = new Date(dateTime);
    const dayOfWeekIndex = date.getDay();
    return daysOfWeek[dayOfWeekIndex];
  };

  const renderDayColumns = () => {
    return selectedWeek?.map((date, index) => (
      <Droppable key={index} droppableId={date}>
        {(provided) => (
          <td
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="status-column status-c p-3"
          >
            {filteredProgresses
              .filter((progress) => progress.date === date)
              .map((progress, progressIndex) => (
                <div key={progress.id}>
                  <ProgressCard
                    sessionUser={sessionUser}
                    progress={progress}
                    users={users}
                    updateCounter={updateCounter}
                    setUpdateCounter={setUpdateCounter}
                    fetch={fetchProgressAndUsers}
                  />
                </div>
              ))}
            {provided.placeholder}
          </td>
        )}
      </Droppable>
    ));
  };

  return isLoading ? (
    <div className="overlay">
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    </div>
  ) : (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="container2">
        <div className="sidebar">
          <div className="task-list">
            <input
              type="text"
              placeholder="Buscar tarefa"
              value={searchTaskQuery}
              onChange={(e) => setSearchTaskQuery(e.target.value)}
              className="form-control"
            />
            <br />
            <Droppable droppableId="tasks" direction="vertical">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {filteredTasks.length === 0 ? (
                    <>Nenhuma tarefa encontrada</>
                  ) : (
                    filteredTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={`task-${task.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              users={users}
                              updateCounter={0}
                              setUpdateCounter={setUpdateCounter}
                              sessionUser={sessionUser}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </div>
        <div className="content">
            <div className="week-navigation d-flex align-items-center">
              <button onClick={handlePreviousWeek} className="btn btn-primary mr-2">Anterior</button>
              <input
                type="text"
                value={new Date(selectedWeekStartDate).toLocaleDateString() + ' até ' + new Date(selectedWeekEndDate).toLocaleDateString()}
                readOnly
                style={
                  {
                    marginRight: '2px',
                  }
                }
              >
              </input>
              {currentWeek < 0 ? <> <button onClick={handleNextWeek} className="btn btn-primary">Próximo</button>  <button onClick={handleActualWeek} className="btn btn-primary">Semana atual</button>  </>: null}
            </div>
            <br />
          <input
            type="text"
            placeholder="Buscar progresso"
            value={searchProgressQuery}
            onChange={(e) => setSearchProgressQuery(e.target.value)}
            className="form-control"
          />
          <table className="table">
          <thead>
            <tr>
              {selectedWeek?.map((date, index) => (
                <th key={index}>
                  {calculateDayOfWeek(date)} - {calculateSumOfHoursAndMinutesForDay(date, filteredProgresses)}
                </th>
              ))}
            </tr>
          </thead>
            <tbody>
              <tr>{renderDayColumns()}</tr>
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <AddProgressModal
          task={draggedTask}
          user={sessionUser}
          onSuccess={() => {
            setDraggedTask(undefined);
            setModalOpen(false);
            fetchProgressAndUsers().then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Progresso cadastrado com sucesso.',
              });
            });

          }}
          onClose={() => {
            setDraggedTask(undefined);
            setModalOpen(false);
          }}
          date={selectedDate}
        />
      )}
    </DragDropContext>
  );
};

export default ProgressPage;
