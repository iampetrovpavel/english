import { useState } from "react"
import useRequest from "./useRequest"

const useReg = (onSuccess) => {
    const [email, setEmail] = useState('test@test.ru')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [reg, errors, loading] = useRequest({
        url: '/api/users/reg',
        method: 'post',
        body: {email, name, password},
        onSuccess
    })
    function handleEmail(e) {
        setEmail(e.target.value)
    }
    function handleName(e) {
        setName(e.target.value)
    }
    function handlePassword(e) {
        setPassword(e.target.value)
    }
    return {email, handleEmail, password, handlePassword, name, handleName, reg, errors, loading}
}

export default useReg