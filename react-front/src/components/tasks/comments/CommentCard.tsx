import React, { useState } from "react";
import { Comment, getStaff, getStaffName } from "../TaskUtils";
import { User } from "../../../utils/GetUser";
import './CommentCard.css';
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../../../api";
import TextEditor from "../../custom/TextEditor";

interface CommentCardProps {
    comment: Comment;
    users: User[];
    removeComment: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({comment, users, removeComment}) => {
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [isDeleted, setDeleted] = useState(false);
    const [isEditing, setEdit] = useState(false);
    const [editedText, setEditedText] = useState(comment.content);
    const [isLoading, setLoading] = useState(false);
    const [success, setSuccess] = useState<Boolean|null>(null);
    const [actualComment, setActualComment] = useState<Comment>(comment);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDeleteConfirmationOpen(true);
        if(isEditing) setEdit(false);
    };
    const confirmDelete = async () => {
            setLoading(true);

            api.delete(`/delete/comment/${comment.id}`)
            .then(() => {
                setSuccess(true)
            })
            .catch(() => {
                setSuccess(false);
                setAlertMessage("Não foi possível deletar o comentário");
            })
            .finally(() => {
                setLoading(false);
                setIsDeleteConfirmationOpen(false);
                setDeleted(true);
                setAlertVisible(true);
                removeComment();
                setTimeout(() => {
                    setAlertVisible(false);
                    setAlertMessage('');
                }, 1000);
            });



    };

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        setEdit(true);
        if(isDeleteConfirmationOpen) setIsDeleteConfirmationOpen(false);
    }

    const cancelDelete = () => {
        setIsDeleteConfirmationOpen(false);
    };

    const handleEditText = (text: string) => {
        setEditedText(text);
    }


    const handleSaveText = () => {

        const textWithoutTags = editedText.replace(/<\/?[^>]+(>|$)/g, "");
        if (!textWithoutTags.trim()) {
        return;
        }
        setLoading(true);

        api.put(`/edit/comment/${comment.id}`, {...comment, content: editedText})
        .then((rp) => {
            setSuccess(true);
            setActualComment(rp.data.Comment);
          })
        .catch(() => {
            setSuccess(false);
            setAlertMessage("Não foi possível editar o comentário");
        })
        .finally(() => {
            setLoading(false);
            setEdit(false);
            setEditedText("");
            setAlertVisible(true);
            setTimeout(() => {
              setAlertVisible(false);
              setAlertMessage('');
            }, 1000);
          });
    }

    const cancelEdit = () => {
        setEdit(false);
        setEditedText('');
    }

    const handleEditMouseEnter = () => {
        document.getElementById("textModal")?.classList.add('textEnter'); 
        document.getElementById("textModal")?.classList.remove('textExit');
    }

    const handleEditMouseLeave = () => {
        document.getElementById("textModal")?.classList.add('textExit'); 
        document.getElementById("textModal")?.classList.remove('textEnter');
    }

    return (
        <>
        {isDeleted ? null : (
            <>
           <div className="comment-item">
                <div className="d-flex align-items-center">
                    {getStaff(comment.user_id, users)?.image && (
                        <img
                            src={getStaff(comment.user_id, users)?.image}
                            alt="Avatar do funcionário"
                            className="avatar-image comment-avatar"
                        />
                    )}
                    <div className="ml-2">
                        <p className="comment-user" style={{
                            paddingLeft: '50px',
                            paddingRight: '50px',
                        }}>
                            <strong>Feito por:</strong> {getStaffName(comment.user_id, users)} |<strong> Data: </strong> {new Date(comment.created_at).toLocaleString()}
                            {(actualComment.edited == true && !isEditing) ? 
                            (<div className='banana'>
                                <div id="textModal" className="textModal">{new Date(actualComment.updated_at).toLocaleString()}</div>
                                <strong
                                    className="cantinho"
                                    onMouseEnter={handleEditMouseEnter}
                                    onMouseLeave={handleEditMouseLeave}
                                >
                                    - Editado
                                </strong>
                            </div>) : null}
                        </p>
                    </div>
                </div>
                <div className="comment-content-entire">
                    <hr />
                    {isEditing ? <TextEditor initialText={actualComment.content} onSave={handleSaveText} onChange={ (editedText) => handleEditText(editedText)} onCancel={() => cancelEdit()} cancellable={true} saveable={true} editable={true}/> : <div
                  dangerouslySetInnerHTML={{ __html: actualComment.content }}
                ></div>}
                </div>
                <div className="comment-icons">
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(e);
                        }}
                    >
                        <FaTrash size={16} color="red" />
                    </div>

                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(e);
                        }}
                    >
                        <FaEdit size={16} color="blue" />
                    </div>
                </div>
            </div>

            {isDeleteConfirmationOpen && (
                <div className="delete-confirmation">
                    <p>Você tem certeza que deseja excluir este comentário?</p>
                    <button className="btn btn-danger" onClick={confirmDelete}>Deletar</button>
                    <button className="btn btn-primary" onClick={cancelDelete}>Cancelar</button>
                </div>
            )}
            {isLoading && (
                <div className="overlay">
                    <div className="loading">
                    <div className="loading-spinner"></div>
                    </div>
                </div>
            )}
            {(alertVisible && !success) && (
                <div className="overlay">
                
                    <div className='loading error'>
                        <p>{alertMessage}</p>
                    </div>
                </div>
            )}
            </>
        )}
 
        </>
    );
}

export default CommentCard;
