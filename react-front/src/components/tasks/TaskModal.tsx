import React, {useEffect} from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {Task, getPriority, getStaff, getStaffName, getStatusName, taskModalFire } from "./TaskUtils";
import { User } from "../../utils/GetUser";
import api from "../../api";

import TaskCommentsDiv from "./TaskCommentsDiv";

interface TaskModalProps {
  task: Task;
  users: User[];
  close: () => void;
  sessionUser: User|null|undefined;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, users, close, sessionUser }) => {
  const modal = withReactContent(Swal);

  useEffect(() => {
    fetchTaskComments();
    taskModalFire(modal, task, users, close);
  }, [modal]);

  const fetchTaskComments = async () => {
    try {
      const response = await api(`/tasks/${task.id}/comments`);
      if (response) {
        modal.update({
          html: (<div className="row">
            <div className="col-md-9 task-row-info">
              <div className="task-info">
                <p><strong>Descrição:</strong></p>
                <div
                  style={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{ __html: task.description }}
                ></div>
                  <TaskCommentsDiv sessionUser={sessionUser} task={task} response={response} users={users}/>
              </div>
            </div>
            <div className="col-md-3 task-row-status">
              <div className="task-status">
                <p><strong>Status:</strong> {getStatusName(task.status)}</p>
                <hr />
                {task.assignee ? (
                  <>
                    <p><strong>Assignee:</strong> {getStaffName(task.assignee, users)}</p>
                    <img src={getStaff(task.assignee, users)?.image} alt="Assignee avatar" className="avatar-image" />
                  </>
                ) : 'Tarefa não atribuída'}
                <hr />
                <p><strong>Prioridade:</strong> {getPriority(task.priority)}</p>
                <hr />
                <p><strong>Data de Vencimento:</strong> <br />{task.due_date ?? ('Sem data')}</p>
                <hr />
                <p><strong>Staff:</strong> {getStaffName(task.staff, users)}</p>
                <img src={getStaff(task.staff, users)?.image} alt="Staff avatar" className="avatar-image" />
              </div>
            </div>
          </div>),
        })
      }
    } catch (error) {}
  };

  return <div></div>;
};

export default TaskModal;
