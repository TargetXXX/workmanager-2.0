import { SweetAlert2 } from "sweetalert2-react-content";
import { User } from "../../utils/GetUser";
import { FaPlus } from "react-icons/fa";

export interface Task {
  id: number;
  name: string;
  description: string;
  status: number;
  staff: number;
  assignee: number | null;
  due_date: string|null; 
  priority: number; 
  comments: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  task_id: number;
  created_at: string;
  updated_at: string;
  truncated_content: string;
  edited: boolean;
}


export const getStatusName = (id: number) => {
    if (id === 0) {
      return <div className="stt">Pendente  </div>;
    } else if (id === 1) {
      return <div className="stt">Em andamento </div>;
    } else if (id === 2) {
      return <div className="stt">Finalizada  </div>;
    } else {
      return <div className="stt">Indefinido  </div>;
    }
  };


export  const getPriority = (id: number) => {
    if (id === 0) {
      return <div className="stt">Baixa <div className="green"></div> </div>;
    } else if (id === 1) {
      return <div className="stt">Média<div className="yellow"></div> </div>;
    } else if (id === 2) {
      return <div className="stt">Urgente <div className="red"></div> </div>;
    } else if (id === 3) {
      return <div className="stt">Muito urgente <div className="redder"></div> </div>;
    } else {
      return <div className="stt">Indefinido <div className="black"></div> </div>;
    }
  };

export const getPriorityColor = (id: number) => {
    if (id === 0) {
      return <div className="stt"> <div className="green"></div> </div>;
    } else if (id === 1) {
      return <div className="stt"> <div className="yellow"></div> </div>;
    } else if (id === 2) {
      return <div className="stt"> <div className="red"></div> </div>;
    } else if (id === 3) {
      return <div className="stt"> <div className="redder"></div> </div>;
    } else {
      return <div className="stt"> <div className="black"></div> </div>;
    }
  };

export  const getStaff = (id: number, users: User[]) => {
    const staff = users.find((user) => user.id === id);
    return staff ? staff : null;
  };

export  const getStaffName = (id: number, users: User[]) => {
    const staff = users.find((user) => user.id === id);
    return staff ? staff.name : 'Usuário não encontrado';
  };

export const taskModalFire = (modal: SweetAlert2, task: Task, users: User[], close: () => void) => modal.fire({
  customClass: "modal-b",
  title: task.name,
  html:  (
    <div className="row">
      <div className="col-md-9 task-row-info">
        <div className="task-info">
          <p><strong>Descrição:</strong></p>
          <div
            style={{ whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{ __html: task.description }}
          ></div>
          <p className='CommentP'><strong>Comentários:</strong> <button className='btn custombtn'><FaPlus color='black'></FaPlus></button></p>
          <p style={{ whiteSpace: 'pre-line' }}>
            <div className="comments-container">
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <div id="loading-text">Carregando...</div>
              </div>
            </div>
          </p>
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
    </div>
  ),
  showCancelButton: false,
  confirmButtonText: "Fechar",
  didClose: close,
});
