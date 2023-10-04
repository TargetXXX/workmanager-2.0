import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Task, getPriorityColor, getStaff } from "./TaskUtils";
import { User } from "../../utils/GetUser";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "../../api";
import TaskModal from "./TaskModal";

interface taskProps {
  task: Task;
  users: User[];
  updateCounter: number;
  setUpdateCounter: React.Dispatch<React.SetStateAction<number>>;
  sessionUser: User|undefined|null;
}

const TaskCard: React.FC<taskProps> = ({
  task,
  users,
  setUpdateCounter,
  updateCounter,
  sessionUser,
}) => {
  const [isOpen, setOpen] = useState(false);

  const history = useNavigate();
  const Modal = withReactContent(Swal);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const result = await Modal.fire({
      title: "Delete",
      text: "Você tem certeza que deseja excluir esta tarefa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Deletar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      Modal.fire({
        title: "Deletando...",
        allowOutsideClick: false,
        didOpen: () => {
          Modal.showLoading();
        },
      });

      try {
        await api.delete(`/delete/task/${id}`);
        setUpdateCounter(updateCounter + 1);
        Modal.close();
        Modal.fire({
          icon: "success",
          title: "Success!",
          text: "Tarefa deletada com sucesso!",
        });
      } catch (error) {
        Modal.close();
        Modal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao deletar tarefa.",
        });
      }
    }
  };

  const handleEdit = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const result = await Modal.fire({
      title: "Edit",
      text: "Você tem certeza que deseja ser redirecionado para a edição dessa tarefa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Editar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) history(`/edit/tasks/${id}`);
  };

  const nameWords = task.name.split(" ");
  const titulo = nameWords.length > 0 ? nameWords[0] : "";
  const truncatedName =
    task.name.length > 50 ? task.name.substring(0, 50) + "..." : task.name;

  return (
    <>
      <Link
        to={`/tasks?id=${task.id}`}
        className={`task-item p-3 mb-3 rounded position-relative status-${task.status}`}
        onClick={() => setOpen(true)}
      >
        <div
          className={`task-content `}
          
        >
          {task.assignee ? (
            <p className="avatar">
              <img
                src={getStaff(task.assignee, users)?.image}
                alt="Assignee avatar"
              />
            </p>
          ) : null}
          <p>
            <strong> {truncatedName}</strong>
          </p>
        </div>
        <div className={`task-footer `}>
          <div className="container-foter">
            <hr />
          </div>
          <div className="task-footer-text">
            {getPriorityColor(task.priority)}
            <strong>  | {titulo} </strong>
            {getStaff(task.staff, users)?.image ? (
              <img
                className="staffAvatar"
                src={getStaff(task.staff, users)?.image}
                alt="Staff avatar"
              />
            ) : null}
          </div>
        </div>
        {
          parseInt(sessionUser?.group ?? '0') >= 5 ? (
            <div className="task-icons">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(e, task.id);
            }}
          >
            <FaEdit size={16} color="blue" />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(e, task.id);
            }}
          >
            <FaTrash size={16} color="red" />
          </div>
        </div>
          )
          : null
        }
      </Link>
      {isOpen && (
        <TaskModal
          task={task}
          users={users}
          close={() => {setOpen(false)}}
          sessionUser={sessionUser}
        />
      )}
    </>
  );
};

export default TaskCard;
