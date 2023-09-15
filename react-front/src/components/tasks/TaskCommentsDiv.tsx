import React, { useState, useEffect } from "react";
import CommentCard from "./comments/CommentCard";
import { User } from "../../utils/GetUser";
import { FaPlus } from "react-icons/fa";
import { AxiosResponse } from "axios";
import { Comment, Task } from "./TaskUtils";
import TextEditor from "../custom/TextEditor";
import api from "../../api";
import "./TaskCommentsDiv.css";

interface TaskCommentsDivProps {
  response: AxiosResponse<Comment[]>;
  users: User[];
  task: Task;
  sessionUser: User | null | undefined;
}

const TaskCommentsDiv: React.FC<TaskCommentsDivProps> = ({
  response,
  users,
  task,
  sessionUser,
}) => {
  const [addComment, setAddComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    setComments(response.data);
  }, [response.data]);

  const handleAddComment = () => {
    setAddComment(!addComment);
  };

  const handleCommentTextSave = () => {
    const textWithoutTags = commentText.replace(/<\/?[^>]+(>|$)/g, "");
    if (!textWithoutTags.trim()) {
      return;
    }
    setLoading(true);

    api
      .post(`/tasks/${task.id}/comments`, {
        content: commentText,
        user_id: sessionUser?.id,
      })
      .then((rp) => {
        setSuccess(true);
        setComments([...comments, rp.data]);
      })
      .catch(() => setSuccess(false))
      .finally(() => {
        setLoading(false);
        setAddComment(false);
        setCommentText("");
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
        }, 1000);
      });
  };

  const cancelAdd = () => {
    setAddComment(false);
  };

  const handleChangeText = (text: string) => {
    setCommentText(text);
  };

  const removeComment = (commentId: number) => {
    const updatedComments = comments.filter((comment) => comment.id !== commentId);
    
    setComments(updatedComments);
  };

  return (
    <>
      <p className="CommentP">
        <strong>Comentários:</strong>{" "}
        <button className="btn custombtn" onClick={handleAddComment}>
          <FaPlus color="black" />
        </button>
      </p>
      {addComment && (
        <div>
          <TextEditor
            initialText=""
            onSave={handleCommentTextSave}
            onChange={(text) => handleChangeText(text)}
            onCancel={cancelAdd}
            cancellable={true}
            saveable={true}
            editable={true}
          />
          <hr />
        </div>
      )}
      {loading && (
        <div className="overlay">
            <div className="loading">
            <div className="loading-spinner"></div>
            </div>
        </div>
      )}
      {(alertVisible && !success) && (
        <div className="overlay">
          
            <div className='loading error'>
                <p>Erro ao criar comentário</p>
            </div>
        </div>
      )}
      <p style={{ whiteSpace: "pre-line" }}>
        <div className="comments-container">
          {comments.length === 0 ? (
            <p>Nenhum comentário</p>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className="comment-wrapper">
                <CommentCard removeComment={() => removeComment(comment.id)} comment={comment} users={users}></CommentCard>
              </div>
            ))
          )}
        </div>
      </p>
    </>
  );
};

export default TaskCommentsDiv;
