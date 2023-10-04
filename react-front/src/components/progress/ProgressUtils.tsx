import { SweetAlert2 } from "sweetalert2-react-content";
import api from "../../api";
import ProgressItems from "./ProgressItems";
import { User } from "../../utils/GetUser";
import Swal from "sweetalert2";

export interface Progress {
  id?: number;
  user_id: number;
  task_id: number;
  description: string;
  date: string;
  time: string;
  horas: string;
  updated_at?: string;
  created_at?: string;
}

export const calculateSumOfHoursAndMinutesForDay = (day: string, progress: Progress[]) => {
  let totalHours = 0;
  let totalMinutes = 0;

  progress
    .filter((progress) => progress.date === day)
    .forEach((progress) => {
      const hoursMatch = progress.horas.match(/(\d+)h/);
      const minutesMatch = progress.horas.match(/(\d+)m/);

      if (hoursMatch) {
        const hours = parseInt(hoursMatch[1]);
        totalHours += hours;
      }

      if (minutesMatch) {
        const minutes = parseInt(minutesMatch[1]);
        totalMinutes += minutes;
        if (totalMinutes >= 60) {
          const additionalHours = Math.floor(totalMinutes / 60);
          totalHours += additionalHours;
          totalMinutes %= 60;
        }
      }
    });

  return `${totalHours}h ${totalMinutes}m`;
};

export const calculateSumOfHoursAndMinutesForProgress = (progress: Progress) => {
  let totalHours = 0;
  let totalMinutes = 0;

 
  const hoursMatch = progress.horas.match(/(\d+)h/);
  const minutesMatch = progress.horas.match(/(\d+)m/);

  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1]);
    totalHours += hours;
  }

  if (minutesMatch) {
    const minutes = parseInt(minutesMatch[1]);
    totalMinutes += minutes;
    if (totalMinutes >= 60) {
      const additionalHours = Math.floor(totalMinutes / 60);
      totalHours += additionalHours;
      totalMinutes %= 60;
    }
  }

  return `${totalHours}h ${totalMinutes}m`;
};

export const progressModalFire = (modal: SweetAlert2, progress: Progress, close: () => void) => modal.fire({
  customClass: "modal-b",
  title: 'Informações de Progresso',
  html:  (
    <div className="row">
      <div className="col-md-9 task-row-info">
        <div className="task-info">
          <p><strong>Descrição:</strong></p>
          <div
            style={{ whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{ __html: progress.description }}
          ></div>
        </div>
      </div>
      <div className="col-md-3 task-row-status">
        <div className="task-status">
          <p><strong>Dia:</strong> {new Date(progress.date).toLocaleDateString()}</p>
          <hr />
          <p><strong>Iniciado às:</strong> { progress.time}</p>
          <hr />
          <p><strong>Tempo gasto:</strong> {calculateSumOfHoursAndMinutesForProgress(progress)}</p>
          <hr />
          <p><strong>Id Tarefa:</strong> {progress.task_id}</p>
          <hr />
          <p><strong>Atualizado em:</strong> {progress.updated_at ? new Date(progress.updated_at).toLocaleDateString() : 'Indefinido'}</p>
        </div>
      </div>
    </div>
  ),
  showCancelButton: false,
  confirmButtonText: "Fechar",
  didClose: close,
});

export const throwAddModal = (
  modal: SweetAlert2,
  progressData: Progress,
  onSuccess: () => void,
  onClose: () => void,
  date: string,
) => {

  modal.fire({
    customClass: {
      container: "custom-modal-container",
    },
    title: "Cadastrar progresso",
    html: (
      <ProgressItems progressData={progressData}/>
    ),
    didClose: onClose,
    focusConfirm: false,
    preConfirm: () => {
      let workedTime = (document.querySelector("#workedTime") as HTMLInputElement).value;
      let datetime = (document.querySelector("#date-time") as HTMLInputElement).value;
      let element = (document.querySelector('.ql-editor') as HTMLInputElement);
      let texto = element.innerHTML;

      if (!texto || !datetime || !workedTime) {
        modal.showValidationMessage("Todos os campos são obrigatórios");
      }

      if (!validateHoursPattern(workedTime)){
        modal.showValidationMessage("Horas inválidas");
      }

      return {
        description: texto,
        date: date,
        time: datetime,
        horas: workedTime,
        user_id: progressData.user_id,
        task_id: progressData.task_id,
      };
    },
    confirmButtonText: "Salvar",
    showConfirmButton: true,
  }).then((result) => {

    console.log(result);
    if (result.isConfirmed) {
      api
        .post(`/register/progress`, result.value)
        .then(() => {
          onSuccess();
        })
        .catch((rp) => {
          console.error(
            "Erro ao atualizar progresso:",
            rp.response.data.message
          );
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao cadastrar progress.',
            footer: rp.response.data.message
          });
        });
    }
  });
};
export const throwEditModal = (
  modal: SweetAlert2,
  progressData: Progress,
  onSuccess: () => void,
  onClose: () => void,
  date: string,
) => {

  modal.fire({
    customClass: {
      container: "custom-modal-container",
    },
    title: "Editar progresso",
    html: (
      <ProgressItems progressData={progressData} />
    ),
    didClose: onClose,
    focusConfirm: false,
    preConfirm: () => {
      let workedTime = (document.querySelector("#workedTime") as HTMLInputElement).value;
      let datetime = (document.querySelector("#date-time") as HTMLInputElement).value;
      let element = (document.querySelector('.ql-editor') as HTMLInputElement);
      let texto = element.innerHTML;

      if (!texto || !datetime || !workedTime) {
        modal.showValidationMessage("Todos os campos são obrigatórios");
      }

      if (!validateHoursPattern(workedTime)){
        modal.showValidationMessage("Horas inválidas");
      }

      return {
        description: texto,
        date: date,
        time: datetime,
        horas: workedTime,
        user_id: progressData.user_id,
        task_id: progressData.task_id,
      };
    },
    confirmButtonText: "Salvar",
    showConfirmButton: true,
  }).then((result) => {

    console.log(result);
    if (result.isConfirmed) {
      api
        .put(`/edit/progress/${progressData.id}`, result.value)
        .then(() => {
          onSuccess();
        })
        .catch((rp) => {
          console.error(
            "Erro ao atualizar progresso:",
            rp.response.data.message
          );
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao atualizar progresso.',
            footer: rp.response.data.message
          });
        });
    }
  });
};
export const validateHoursPattern = (hours: string) => {
  const pattern = /^(\d+h\s*)?(\d+m\s*)?$/;
  return pattern.test(hours);
};
