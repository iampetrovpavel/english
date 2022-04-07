import React, { useEffect, useRef, useState } from "react";
import useRandomList from "../hooks/useRandomList";
import { Card, Button, Modal, Input, Space, Menu, Dropdown, Pagination} from 'antd';
import useModal from "../hooks/useModal";

const Play = () => {
    const { list, fetch } = useRandomList()
    const [ remain, setRemain ] = useState(0)
    const [ answer, setAnswer ] = useState('')
    const [ nextButton, showNextButton ] = useState(false)
    const { isModalVisible, showModal, handleOk, handleCancel } = useModal()
    const [ stat, setStat ] = useState([])
    const cardRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if(list.length > 0) {
            cardRef.current.classList.remove('animate__backOutDown')
            cardRef.current.classList.add('animate__backInDown')
            setRemain(list.length)
        }
    }, [list])

    function handleForgot() {
        inputRef.current.input.classList.add('fail')
        setAnswer(list[remain-1].trans[0])
        showNextButton(true)
        setStat([...stat, {word: list[remain-1], success: false}])
    }

    function handleNext() {
        cardRef.current.classList.add('animate__backOutDown')
        setTimeout(()=>{
            inputRef.current.input.classList.remove('fail')
            showNewCard()
            showNextButton(false)
        }, 300)
    }

    function showNewCard() {
        setAnswer('')
        if (remain-1 === 0) {
            showModal()
            setRemain(remain-1)
        } else {
            cardRef.current.classList.remove('animate__backOutDown')
            cardRef.current.classList.add('animate__backInDown')
            setRemain(remain-1)
        }
    }

    function startNewGame() {
        handleOk()
        setStat([])
        fetch()
    }

    function handleAnswerInput(e) {
        if(nextButton)return;
        const value = e.target.value;
        if( list[remain-1].trans.includes(value)){
            setStat([...stat, {word: list[remain-1], success: true}])
            inputRef.current.input.classList.add('success')
            setTimeout(()=>{
                inputRef.current.input.classList.remove('success')
                cardRef.current.classList.remove('animate__backInDown')
                cardRef.current.classList.add('animate__backOutDown')
                setTimeout(()=>{
                    showNewCard()
                }, 300)
            }, 600)
        }
        setAnswer(value);
    }
    function inclination(num){
        if(num===1)return 'о'
        if(num===2 || num===3 || num===4)return 'а'
        return null
    }
    if(list.length === 0){return <h1>Loading...</h1>}
    return (
        <div style={{paddingTop: '1em', height: '100%'}}>
            {remain===0?<Button type="link" success="true" onClick={ startNewGame }>
                            Начать тренировку
                        </Button>
                        :<h3>Осталось { remain } слов{inclination(remain)}</h3>}
            <Card ref={cardRef} size="small" title={ list[remain?remain-1:0].word } style={{ minWidth: '300px', maxWidth: '500px', marginTop: '1em', display:remain===0?'none':'block' }} className='animate__animated'>
                <Space>
                    <Input ref={inputRef} placeholder="Слово на русском" value={ answer } onChange={ handleAnswerInput }/>
                    {nextButton?<Button type="link" success="true" onClick={ handleNext }>
                        Дальше
                    </Button>
                    :<Button type="link" success="true" onClick={ handleForgot }>
                        Не помню
                    </Button>}
                </Space>
            </Card>
            <Modal title="Результаты" visible={isModalVisible} onCancel={handleCancel} footer={[
                <Button key={1} type="link" success="true" onClick={ startNewGame }>
                    Еще раз
                </Button>
            ]}>
                <Space direction="vertical">
                    Правильных ответов: {stat.filter(item=>item.success).length}
                    Неправильных ответов: {stat.filter(item=>!item.success).length}
                </Space>
            </Modal>
        </div>
    )
}

export default Play