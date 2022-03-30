import { useEffect, useState } from "react"
import useRequest from "./useRequest"
import { useNavigate} from "react-router-dom";

const useMe = (onSuccess, onFail) => {
    const [me, setMe] = useState(null)
    const navigate = useNavigate();
    const [fetchMe, errors, loading] = useRequest({
        url: '/api/users/me',
        method: 'post',
        onSuccess,
        onFail
    })
    const [exit] = useRequest({
        url: '/api/users/exit',
        method: 'post',
        onSuccess: function (data){
            setMe(null)
            navigate('/login')
        },
        onFail
    })
    useEffect(()=>{
        fetchMe()
    }, [])
    return { me, loading, errors, setMe, exit, loading}
}

export default useMe