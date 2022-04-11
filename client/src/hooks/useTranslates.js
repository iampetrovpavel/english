import { useEffect, useState } from 'react'
import useRequest from './useRequest'

const useTranslates = () => {
    const [data, setData] = useState({})
    const [fetch, errors, loading] = useRequest({
        url: '/api/translates/list',
        method: 'post',
        onSuccess: (data) => {
            setData(data)
        }
    })
    const [remove] = useRequest({
        url: '/api/translates/remove',
        method: 'post',
        onSuccess: () => {
            fetch()
        }
    })

    const [check] = useRequest({
        url: '/api/translates/update',
        method: 'post',
        onSuccess: () => {
            fetch()
        }
    })

    function addWord(word) {
        setData({...data, rows: [word, ...data.rows]})
    }

    useEffect(()=>{
        // fetch()
    },[])
    
    const {rows:translates = [], total = 0, page = 1, pageSize = 10} = data;

    return {translates, total, page, pageSize, fetch, remove, errors, loading, addWord, check}
}

export default useTranslates;