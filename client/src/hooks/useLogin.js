import { useState } from "react"
import useRequest from "./useRequest"

const useLogin = (callback) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [login, errors, loading] = useRequest({
        url: '/api/users/login',
        method: 'post',
        body: {email, password},
        onSuccess: function (data){
            callback(data)
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