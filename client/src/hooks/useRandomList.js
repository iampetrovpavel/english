import { useEffect, useState } from "react"
import useRequest from './useRequest'

const useRandomList = () => {
    const [list, setList] = useState([])
    const [fetch, errors, loading] = useRequest({
        url: '/api/users/random',
        method: 'post',
        onSuccess: (data) => {
            setList(data)
        }
    })
    useEffect(() => {
        fetch();
    }, [])
    return { list, fetch }
}

export default useRandomList;