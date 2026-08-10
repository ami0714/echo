import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import '../../css/Comment.css';
import {Icon} from '@iconify/react';
import { motion } from 'framer-motion';
import {useAuth} from '../../context/AuthContext'
import { getComments,createComment } from '../../api/post';




const CommentSection = ({ postId,setNull }) => {
  const [Comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const {user} = useAuth()
  const navigate = useNavigate();



 

  useEffect(() => {
    const fetchComments = async()=>{
     try {
        const data = await getComments(postId); // tunggu promise selesai
        setComments(data); // data adalah array komen
      } catch (error) {
        console.error('error:', error);
      }
    }
    fetchComments()
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed) return;

    const res = await createComment(trimmed,postId);
    console.log(res)
    
    setNewComment('');
     try {
        const data = await getComments(postId); // tunggu promise selesai
        setComments(data); // data adalah array komen
      } catch (error) {
        console.error('error:', error);
      }
    

  };

   const navigateToProfile = (id) => {
    if(id !== user.userId){
      navigate(`/profile/${id}`);
    }
    if(id === user.userId){
      navigate(`/userProfile`);
    }

  }

  return (
    <motion.aside 
      className="comment-section"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.1, ease: 'easeIn' }}
    >
      <div className="comment-header">
        <h2>Comment</h2>
        <Icon onClick={()=>setNull(null)} icon="mdi:close" className="comment-close-icon" />
      </div>
      <div className="comment-list">
        {Comments.map((comment, index) => (
          <article key={index} className="comment-item">
            <div onClick={()=> navigateToProfile(comment.userId)} className="comment-author">{comment.username}</div>
            <p className="comment-text">{comment.comment}</p>
          </article>
        ))}
      </div>

      <form className="comment-input-wrapper" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Type here..." 
          aria-label="Tambah komen baru"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" className="comment-send-btn" aria-label="Hantar komen">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </motion.aside>
  );
};

export default CommentSection;