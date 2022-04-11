import { useEffect, useState } from 'react'
import useRequest from './useRequest'

const useWords = () => {
    const [data, setData] = useState({})
    const [fetch, errors, loading] = useRequest({
        url: '/api/users/words',
        method: 'post',
        onSuccess: (data) => {
            setData(data)
        }
    })
    const [remove] = useRequest({
        url: '/api/users/learned',
        method: 'post',
        onSuccess: () => {
            fetch()
        }
    })

    function addWord(word) {
        setData({...data, rows: [word, ...data.rows]})
    }

    useEffect(()=>{
        fetch()
    },[])
    
    const {rows:words = [], total = 0, page = 1, pageSize = 10} = data;

    return {words, total, page, pageSize, fetch, remove, errors, loading, addWord }
}

export default useWords;