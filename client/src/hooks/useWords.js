import { useEffect, useState } from 'react'
import useRequest from './useRequest'

const useWords = () => {
    const [data, setData] = useState({})
    const [fetch] = useRequest({
        url: '/api/words/list',
        method: 'post',
        onSuccess: (data) => {
            setData(data)
        }
    })
    useEffect(()=>{
        fetch()
    },[])
    
    const {rows:words = [], total = 0, page = 1, pageSize = 10, totalPages} = data;

    return {words, total, page, pageSize, totalPages, fetch}
}

export default useWords;