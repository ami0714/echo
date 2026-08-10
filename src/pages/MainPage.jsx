import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {useAuth} from '../context/AuthContext'
import Sidebar from '../components/common/SideBar';
import CommentSection from '../components/common/Comment';
import { Icon } from "@iconify/react";
import '../css/MainPage.css';
import {getPost,createPost,likePost} from '../api/post'





const MainPage = () => {
  // SEO Optimization
  useEffect(() => {
    document.title = 'EcHo - Berhubung dengan Dunia';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = 'Terokai timeline EcHo, lihat apa yang dikatakan orang lain, dan berinteraksi dengan komuniti.';
    }
  }, []);
  
  // const [isShowComment, setIsShowComment] =useState(false)
  const {user} = useAuth()
  const BASEURL_STORAGE = import.meta.env.VITE_BASE_URL_STORAGE;
  const [typePost,setTypePost] = useState('global');
  const [postData,setPostData] = useState([]);
  const [postId,setPostId] = useState(null);
  const [newPost,setNewPost] = useState('');
  const [message,setMessage] = useState(null)
  const navigate = useNavigate();
 

  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await getPost(typePost); 
        setPostData(posts); // simpan array ke state
      } catch (error) {
        console.error('Gagal memuatkan posts:', error);
      }
    };

    fetchData();
  }, [typePost]);




const commentAction = (id) => {
  try {
    //  setIsShowComment((prev) => !prev) 

     setPostId((prevId)=>{
       if (prevId === id) return null;
      // Jika klik pada post lain -> buka yang baru
      return id;
     })
  } catch (error) {
    console.log(error)
  }

}

const handleSendPost = async () => {
    const content = newPost.trim();

    if (!content) {
      setMessage('Kandungan post tidak boleh kosong');
      return;
    }

    try {
      const resMessage = await createPost(content);
      console.log(resMessage)
      setMessage(resMessage);
      setNewPost('');

      const posts = await getPost(typePost);
      setPostData(posts);
    } catch (error) {
      setMessage(error.message || 'Gagal menghantar post');
    }
  };


  useEffect(()=>{

    if(message !== null){
      const timer = setTimeout(()=>{
          setMessage(null)
      },3000)
      return () => clearInterval(timer)
    }

  },[message])


  const likeAction = async (postId,isLike) => {

      setPostData(prev=> prev.map(post=> post.postId === postId ?
        { ...post, isLike: !post.isLike  } : post
      ))
      
      if(isLike){
        setPostData(prev=> prev.map(post=> post.postId === postId ?
        { ...post, likes: post.likes - 1  } : post
      ))
      }else if(!isLike){
        setPostData(prev=> prev.map(post=> post.postId === postId ?
        { ...post, likes: post.likes + 1  } : post
      ))
      }
      
      

      try {
        const res = await likePost(postId);
        console.log(res)
      } catch (error) {
        console.error('Gagal like post:', error);
        setPostData(prev=> prev.map(post=> post.postId === postId ?
        { ...post, isLike: !post.isLike  } : post
      ))
      }



  }

  const navigateToProfile = (id) => {
    if(id !== user.userId){
      navigate(`/profile/${id}`);
    }
    if(id === user.userId){
      navigate(`/UserProfile`);
    }

  }


  


  
  



  return (
    <div className="main-layout">
      {/* 1. Sidebar Kiri */}
      <div className="sidebar-spacer"><Sidebar postType={(type)=> setTypePost(type)}/></div>

     
      

      {/* 2. Feed Tengah (Utama) */}
      <motion.main 
        className="feed-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
         {message !== null &&(
         
       <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        
       
       className="alert-box">
        <p style={{color:'white'}}>{message}</p>
       </motion.div>
       
      )

      }
        {/* Input Post (What do you think?) */}
        <div className="feed-input-wrapper">
          <textarea onChange={(e)=> setNewPost(e.target.value) }
          value={newPost}
            type="text" 
            placeholder="What do you think?" 
            aria-label="Apa yang anda fikirkan?"
          />
          <button onClick={handleSendPost} className="send-icon-btn" aria-label="Hantar post">
            {/* Send Icon SVG */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>

        {/* Senarai Posts (Looping map) */}
        {postData.map((post, index) => {
         

          return (
          <motion.article 
            key={index} 
            className="post-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
           
            <header className="post-header">
              <div className="post-avatar">
                 {
              post.profilePath == null? <span>avatar</span>:<img src={`${BASEURL_STORAGE}${post.profilePath}`} />
            } 
              </div>
              <span onClick={()=> navigateToProfile(post.userId)} className="post-username">{post.username}</span>
            </header>
            
            <p className="post-content">
              {post.content}
            </p>
             
            <footer className="post-actions">
       
                <div className="action-btn" aria-label="Like post">
                <Icon
                  onClick={() => likeAction(post.postId,post.isLike)}
                  style={{ color: post.isLike == true ? '#5C4AD2' : 'black' }}
                  className='icon'
                  icon="icon-park-twotone:like"
                />
                {post.likes}
                </div>
           
              
              <button
                className="action-btn"
                aria-label="Lihat komen"
                onClick={() => commentAction(post.postId)}//prev ialah nilai sebelum
              >
                <svg viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                {post.comments}
              </button>
            </footer>
          </motion.article>
          );
        })}
      </motion.main>

      {/* 3. Comment Section Kanan (Hantar dummy comments sebagai props) */}
      {postId !== null && (
        <CommentSection setNull={(value)=> setPostId(value)} postId={postId} />
      )

      }
      
    </div>
  );
};

export default MainPage;