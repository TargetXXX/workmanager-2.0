import React, {useEffect} from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { User } from "../../utils/GetUser";
import { Progress, progressModalFire } from "./ProgressUtils";


interface ProgressModalProps {
  progress: Progress;
  close: () => void;
}

const ProgressInfoModal: React.FC<ProgressModalProps> = ({ progress, close }) => {
  const modal = withReactContent(Swal);

  useEffect(() => {
    progressModalFire(modal, progress, close);
  }, [modal]);

  return <div></div>;
};

export default ProgressInfoModal;
