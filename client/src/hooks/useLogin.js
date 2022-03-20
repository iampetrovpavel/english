import { useState } from "react"
import useRequest from "./useRequest"

const useLogin = (onSuccess) => {
    const [email, setEmail] = useState('test@test.ru')
    const [password, setPassword] = useState('1212')
    const [login, errors, loading] = useRequest({
        url: '/api/users/login',
        method: 'post',
        body: {email, password},
        onSuccess: (data)=>{
            onSuccess(data)
        }
    })
    function handleEmail(e) {
        setEmail(e.target.value)
    }
    function handlePassword(e) {
        setPassword(e.target.value)
    }
    return {email, handleEmail, password, handlePassword, login}
}

export default useLogin