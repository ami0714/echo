
import { get,post,del} from "../utils/apiHelper";




export async function getPost(type){
    


const res = await get(`/posts?type=${type}`)






 return res.data
}

export async function getPostById(type,userId){
    


const res = await get(`/posts/${userId}?type=${type}`)






 return res.data
}

export async function getComments(postId){
    const res = await get(`/posts/${postId}/comments`)

    return res.data
}

export async  function createPost(content) {

    const body = {
        content:content
    }

    const res = await post('/posts/add',body)

    if(res.status == "success"){
        return res.message;

    }

    
}

export async  function createComment(content,postId) {

    const body = {
        content:content
    }

    const res = await post(`/posts/${postId}/comments/add`,body)

    if(res.status == "success"){
        return res.message;

    }

    
}

export async function likePost(postId) { 
    const body = {

    }

    const res = await post(`/posts/${postId}/like`,body)

    if(res.status == "success"){
        return res;
    }
}


export async function deletePost(postId) {
    const res = await del(`/posts/${postId}/delete`)

    if(res.status == "success"){
        return res;
    }

}