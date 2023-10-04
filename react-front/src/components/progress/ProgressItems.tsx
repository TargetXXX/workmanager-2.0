import React, { useEffect, useState } from "react";
import TextEditor from "../custom/TextEditor";
import { Progress } from "./ProgressUtils";

interface ProgressItemsProps {
  progressData: Progress;
}

const ProgressItems: React.FC<ProgressItemsProps> = ({
  progressData,
}) => {
  const [workedTime, setWorkedTime] = useState(progressData.horas ?? "");
  const [dateTime, setDateTime] = useState( progressData.time ?? "");

  const handleWorkedTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWorkedTime(value);
  };

  const gravaTexto = (texto:string) => {
    let element  = (document.getElementById('text-comment') as HTMLInputElement);
    element.value = texto;
  };


  return (
    <div className="custom-modal-content">
      <input type="hidden" id="text-comment" value=''/>
      <div className="custom-modal-input">
        <TextEditor
          initialText={progressData.description || ""}
          cancellable={false}
          saveable={false}
          editable={true}
          onChange={(text: string) => {
            gravaTexto(text)
          }}
          short={true}
        />
      </div>
      <div className="custom-modal-input">
        <input
          type="time"
          className="form-control"
          placeholder="Selecione a data e hora"
          value={dateTime}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setDateTime(event.target.value);
          }}
          id="date-time"
        />
      </div>
      <div className="custom-modal-input">
        <input
          type="text"
          id="workedTime"
          className="swal2-input"
          placeholder="Tempo Trabalhado (Ex: 2w 3d 5h 4m)"
          value={workedTime}
          onChange={handleWorkedTimeChange}
        />
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default ProgressItems;
function setTexto(texto: string) {
  throw new Error("Function not implemented.");
}

