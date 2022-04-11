import { useEffect, useState } from 'react'
import useRequest from './useRequest'

const useDictionary = (props) => {
    const [data, setData] = useState({})
    const [fetch, errors, loading] = useRequest({
        url: '/api/words/list',
        method: 'post',
        onSuccess: (data) => {
            setData(data)
        },
        ...props
    })
    const [remove] = useRequest({
        url: '/api/words/remove',
        method: 'post',
        onSuccess: () => {
            fetch()
        }
    })

    const [check] = useRequest({
        url: '/api/words/update',
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

    return {words, total, page, pageSize, fetch, remove, errors, loading, addWord, check}
}

export default useDictionary;