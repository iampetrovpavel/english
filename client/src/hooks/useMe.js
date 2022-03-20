import { useEffect, useState } from "react"
import useRequest from "./useRequest"
import { useNavigate} from "react-router-dom";

const useMe = (setUser) => {
    const [me, setMe] = useState(null)
    const navigate = useNavigate();
    const [fetchMe, errors, loading] = useRequest({
        url: '/api/users/me',
        method: 'post',
        onSuccess: function (data){
            setMe(data)
        }
    })
    const [exit] = useRequest({
        url: '/api/users/exit',
        method: 'post',
        onSuccess: function (data){
            setMe(null)
            navigate('/login')
        }
    })
    useEffect(()=>{
        fetchMe()
    }, [])
    return { me, loading, errors, setMe, exit}
}

export default useMe