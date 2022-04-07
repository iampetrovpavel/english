import { useState } from 'react'
import useRequest from './useRequest'

const useNewWord = (onSuccess) => {
    const [word, setWord] = useState('')
    const [translate, setTranslate] = useState('')
    const [create, errors, loading] = useRequest({
        url: '/api/users/remember',
        method: 'post',
        onSuccess
    })
    function handleWordInput(e){
        setWord(e.target.value)
    }
    function handleTransInput(e){
        setTranslate(e.target.value)
    }
    return { create, errors, loading, handleWordInput, handleTransInput, word, translate }
}

export default useNewWord;