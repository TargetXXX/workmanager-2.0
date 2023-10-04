import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Progress } from "./ProgressUtils";
import { User } from "../../utils/GetUser";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "../../api";
import ProgressInfoModal from "./ProgressInfoModal";
import EditProgressModal from "./EditProgressModal";

interface ProgressCardProps {
  progress: Progress;
  users: User[];
  updateCounter: number;
  setUpdateCounter: React.Dispatch<React.SetStateAction<number>>;
  sessionUser: User | undefined | null;
  fetch: () => Promise<void>;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  progress,
  fetch,
  updateCounter,
  setUpdateCounter,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);

  const Modal = withReactContent(Swal);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const result = await Modal.fire({
      title: "Delete",
      text: "Você tem certeza que deseja excluir este progresso?",
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
        await api.delete(`/delete/progress/${id}`);
        setUpdateCounter(updateCounter + 1);
        Modal.close();
        Modal.fire({
          icon: "success",
          title: "Success!",
          text: "Progresso deletado com sucesso!",
        });
      } catch (error) {
        Modal.close();
        Modal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao deletar progresso.",
        });
      }
    }
  };

  const handleEdit = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();

    setEditOpen(true);
  };

  const removeTags = (htmlString: string) => {
    return htmlString.replace(/<[^>]*>?/gm, "");
  };

  const descWithoutTags = removeTags(progress.description);

  const truncatedDesc =
    descWithoutTags.length > 10
      ? descWithoutTags.substring(0, 10) + "..."
      : descWithoutTags;

  return (
    <>
      <Link
        to={`/progress?id=${progress.id}`}
        className={`progress-item p-3 mb-3 rounded position-relative`}
        onClick={() => {
          setOpen(true);
        }}
      >
        <div
          className={`task-content `}
          style={{ whiteSpace: "pre-line" }}
        >
          {truncatedDesc}
        </div>
        <div className={`task-footer `}>
          <div className="container-foter">
            <hr />
          </div>
          <div className="task-footer-text">Task: {progress.task_id}</div>
        </div>
        <div className="progress-icons">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(e, progress.id ?? 0);
            }}
          >
            <FaEdit size={16} color="blue" />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(e, progress.id ?? 0);
            }}
          >
            <FaTrash size={16} color="red" />
          </div>
        </div>
      </Link>
      {isOpen && (
        <ProgressInfoModal progress={progress} close={() => setOpen(false)} />
      )}
      {isEditOpen && (
        <EditProgressModal
          progress={progress}
          onSuccess={() => {
            setEditOpen(false);
            fetch().then(() => {
              Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "Progresso atualizado com sucesso.",
              });
            });
          }}
          onClose={() => {
            setEditOpen(false);
          }}
          date={progress.date}
        />
      )}
    </>
  );
};

export default ProgressCard;
