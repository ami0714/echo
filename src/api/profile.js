import { get,post,postFormData } from "../utils/apiHelper";


export async function getProfile(id){

const res = await get(`/user/${id}`)

return res.data


}

export async function updateProfile(formData){ 

const res = await postFormData(`/user/update`,formData)

return res.data;
}

export async function handleFollow(followingId){ 
    const body = {

    }

    const res = await post(`/follow/${followingId}`,body)

    if(res.status == "success"){
        return res;
    }
}


