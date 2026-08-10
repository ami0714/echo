import React, { useEffect,useState } from 'react';
import { motion } from 'framer-motion'
import {useNavigate} from 'react-router-dom';
import '../css/profileUser.css';
import Sidebar from '../components/common/SideBar';
import CommentSection from '../components/common/Comment';
import {useAuth} from '../context/AuthContext'
import {getPost,deletePost} from '../api/post'








const ProfileUser = () => {

  const {user,logout} = useAuth()
  const BASEURL_STORAGE = import.meta.env.VITE_BASE_URL_STORAGE;
  const navigate = useNavigate();
    const [isShowComment, setIsShowComment] =useState(false)
    const [postData,setPostData] = useState([]);
    const [postId,setPostId] = useState(null);
  // SEO Optimization
  useEffect(() => {
    document.title = `Profil ${postData.username} - EcHo`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = `Lihat profil ${profileData.username} di EcHo, termasuk followers, following, dan senarai post.`;
    }
  }, []);

 

       useEffect(() => {
           const fetchData = async () => {
             try {
               const posts = await getPost('own'); 
               setPostData(posts); // simpan array ke state
             
             } catch (error) {
               console.error('Gagal memuatkan posts:', error);
             }
           };
       
           fetchData();
         }, []);
       
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

const handleDeletePost = async (postId) => {

  try {
    const res = await deletePost(postId);
    if (res.status === "success") {
      // Kemas kini state untuk mengeluarkan post yang dipadam
      setPostData(prev => prev.filter(post => post.postId !== postId));
    }
  } catch (error) {
    console.error('Gagal memadam post:', error);
  }
  }
console.log(user)
        


  
  
     

  return (
    <div className="profile-layout">
      {/* Ruang Kosong untuk Sidebar (kerana anda sudah ada komponen sidebar sendiri) */}
      <div className="sidebar-spacer"><Sidebar/></div>

      {/* Bahagian Tengah (Kandungan Profil) */}
      <motion.main 
        className="profile-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        
        {/* 1. Header Profil (Avatar, Stats, Button) */}
        <motion.section 
          className="profile-header-card"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="profile-avatar">
            {
              user?.profilePath == null? <span>avatar</span>:<img src={`${BASEURL_STORAGE}${user?.profilePath}`} />
            }
          </div>
          
          <div className="profile-info">
            <h1 className="profile-username">{user?.username}</h1>
            <div className="profile-stats">
              <span>{user?.followings} following</span>
              <span>{user?.followers} follower</span>
            </div>
            <button onClick={()=> navigate('/editProfile')} className="edit-profile-btn" aria-label="Edit Profil">
              Edit Profile
            </button>
          </div>
        </motion.section>

        {/* 2. Senarai Post (Looping Map dengan dummy data) */}
        <section className="profile-posts-container">
          {postData.map((post, index) => (
            <motion.article 
              key={index} 
              className="post-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
            >
              {/* Header Kad + Butang Delete */}
              <header className="post-header">
                <div className="post-avatar-small">
                 {
              post.profilePath == null? <span>avatar</span>:<img src={`${BASEURL_STORAGE}${post.profilePath}`} />
            } 
                </div>
                <span className="post-username">{post.username}</span>
                
                {/* Ikon Tong Sampah (Delete) */}
                <button onClick={() => handleDeletePost(post.postId)} className="delete-btn" aria-label="Padam post">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </header>
              
              <p className="post-content">
                {post.content}
              </p>
              
              {/* Footer Tindakan (Like & Komen) */}
              <footer className="post-actions">
                <button className="action-btn" aria-label="Like post">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  {post.likes}
                </button>
                
                <button 
                  onClick={() => commentAction(post.postId)}//prev ialah nilai sebelum
                className="action-btn" aria-label="Lihat komen">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  {post.comments}
                </button>
              </footer>
            </motion.article>
          ))}
        </section>

      </motion.main>
      {/* 3. Comment Section Kanan (Hantar dummy comments sebagai props) */}
       {postId !== null && (
        <CommentSection setNull={(value)=> setPostId(value)} postId={postId} />
      )}
    </div>
  );
};

export default ProfileUser;