import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { AuthContext } from "../../providers/AuthProvider";
import { deleteComment, getAllComments } from "../../services/apiCalls";
import { useNavigate } from "react-router-dom";
import CommentBox from "../../components/CommentBox/CommentBox";
import { PasswordForm } from "../../components/PasswordForm/PasswordForm";

const Profile = () => {
  const [comments, setComments] = useState([]);
  const [commentBox, setCommentBox] = useState(false);
  const [passForm, setPassForm] = useState(false)
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getCommentsList();
  }, []);

  useEffect(() => {
    if (user === null) navigate("/");
  });

  const getCommentsList = async () => {
    let response = await getAllComments();
    setComments(response.data);
  };

  const deleteThisComment = (comment) => {
    deleteComment(comment)
    getCommentsList();
  };

  const editThisComment = () => {
    setCommentBox(!commentBox);
  };

  const togglePassForm = () => {
    setPassForm(!passForm)
  }

  return (
    <div className="profileDesign">
      <div>
        USER INFO:
        <div>{user.name}</div>
        <div>{user.email}</div>
        <button onClick={() => togglePassForm()}>Change PASSWORD</button>
        {passForm === true ? <PasswordForm user={user} togglePassForm={togglePassForm}/>: null }
      </div>
      <div>FLAGED COMMENTS:</div>
      {comments.map((comment) => {
        if (comment.badWordFlaged === true && comment.userID === user.id)
          return (
            <div>
              {" "}
              <div>{comment.user}</div>
              <div>{comment.createdAt}</div>
              <div>{comment.body}</div>
              <button onClick={() => deleteThisComment(comment)}>Delete</button>
              <button onClick={()=> editThisComment(comment)}>Edit</button>
              <br></br>
              {commentBox === true ? <CommentBox getComments={getCommentsList} comment={comment} aproval={"aproval"} /> : null}
            </div>
          );
      })}
<div>REPORTED COMMENTS:</div>
{comments.map((comment) => {
        if (comment.reported === true && comment.userID === user.id)
          return (
            <div>
              {" "}
              <div>{comment.user}</div>
              <div>{comment.createdAt}</div>
              <div>{comment.body}</div>
              <button onClick={() => deleteThisComment(comment)}>Delete</button>
              <span>Waiting Admin aproval</span>
              <br></br>
              {commentBox === true ? <CommentBox getComments={getCommentsList} comment={comment}  /> : null}
            </div>
          );
      })}
    </div>
  );
};

export default Profile;
