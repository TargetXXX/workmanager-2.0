import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { User } from '../../utils/GetUser';
import { Task } from '../tasks/TaskUtils';
import { Progress, throwAddModal } from './ProgressUtils';

interface AddProgressModalProps {
  task: Task | null | undefined;
  user: User | null | undefined;
  onSuccess: () => void;
  onClose: () => void;
  date: string;
}

const MySwal = withReactContent(Swal);

const AddProgressModal: React.FC<AddProgressModalProps> = ({ task, user, onSuccess, onClose, date}) => {
  const progressData = {
    user_id: user ? user.id : 0,
    task_id: task ? task.id : 0,
    description: '',
    date: '',
    horas: '',
    time: '',
  };



  useEffect(() => {
    throwAddModal(MySwal, progressData, onSuccess, onClose, date);
  }, []);
 

  return null;
};

export default AddProgressModal;
