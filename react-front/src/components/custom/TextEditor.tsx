import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor: React.FC<{
  initialText: string;
  onSave?: (editedText: string) => void;
  onCancel?: () => void;
  onChange?: (text: string) => void;
  cancellable: boolean;
  saveable: boolean;
  editable: boolean;
  short?: boolean;
}> = ({ initialText, onSave, onCancel, cancellable, saveable, editable, onChange, short }) => {
  const [text, setText] = useState(initialText);
  
  const modules = short ? {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean'],
      
    ],
  } : {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean'],
      ['size'],
      ['font'],
    ],
  };
  
  const formats =short ? [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link',
  ] : [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link',
    'image',
    'size',
    'font',
    'code-block',
    'blockquote',
  ];

  const handleChange = (content: string) => {
    if(onChange) onChange(content);
    setText(content);
  };

  const handleSave = () => {
    if(onSave) onSave(text);
  };

  const handleCancel = () => {
    if(onCancel) onCancel();
  };

  return (
    <div className="text-editor">
      <ReactQuill
        value={text}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        readOnly={!editable}
        id='text-editor'
      />
      <div className="editor-buttons mt-2"> {
        saveable ?  <button className="btn btn-success" onClick={handleSave}>Salvar</button> : null
        
      }
      {
        cancellable ? <><button className="btn btn-primary" onClick={handleCancel}>Cancelar</button></> : null
      }
      </div>
    </div>
  );
};

export default TextEditor;
