import { useState } from 'react'
import useRequest from './useRequest'

const useNewWord = (done) => {
    const [word, setWord] = useState('')
    const [trans, setTrans] = useState('')
    const [create, errors, loading] = useRequest({
        url: '/api/words/create',
        method: 'post',
        onSuccess: () => {
            done()
        }
    })
    function handleWordInput(e){
        setWord(e.target.value)
    }
    function handleTransInput(e){
        setTrans(e.target.value)
    }
    return { create, errors, loading, handleWordInput, handleTransInput, word, trans }
}

export default useNewWord;