import axios from 'axios'
import {useState} from "react";

const useRequest = ({ url, method, body, onSuccess, onFail}) => {
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)

    const doRequest = async (props = {}) => {
        try{
            setLoading(true)
            setErrors(null)
            // console.log("REQUEST ", url + (props.params || '') + (props.query || ''), body, props.body)
            const response = await axios[method](url + (props.params || '') + (props.query || ''), props.body || body, { withCredentials: true })
            // console.log("RESPONSE ",response.data)
            if(props.onSuccess){
                props.onSuccess(response.data)
                return response.data
            }
            if(onSuccess){
                onSuccess(response.data)
            }
            return response.data
        }
        catch(error){
            if(!error.response || !error.response.data) {
                setErrors([{message: 'Что-то пошло не так...'}])
                if(onFail) { onFail(error); }
                return
            }
            setErrors(error.response.data)
            if(onFail) { onFail(error.response.data) }
        }
        finally {
            setLoading(false)
        }
    }

    return [doRequest, errors, loading]
}

export default useRequest