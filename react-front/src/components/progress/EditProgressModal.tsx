import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { User } from '../../utils/GetUser';
import { Task } from '../tasks/TaskUtils';
import { Progress, throwAddModal, throwEditModal } from './ProgressUtils';

interface AddProgressModalProps {
  progress: Progress;
  onSuccess: () => void;
  onClose: () => void;
  date: string;
}

const MySwal = withReactContent(Swal);

const EditProgressModal: React.FC<AddProgressModalProps> = ({ progress, onSuccess, onClose, date}) => {




  useEffect(() => {
    throwEditModal(MySwal, progress, onSuccess, onClose, date);
  }, []);
 

  return null;
};

export default EditProgressModal;
