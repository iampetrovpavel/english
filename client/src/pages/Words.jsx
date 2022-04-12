import React, { useEffect, useRef } from "react";
import { Card, Button, Modal, Input, Space, Menu, Dropdown, Pagination} from 'antd';
import {DownCircleOutlined, DeleteOutlined, AppstoreAddOutlined, LoadingOutlined} from '@ant-design/icons'
import useModal from '../hooks/useModal'
import useWords from "../hooks/useWords";
import useNewWord from "../hooks/useNewWord";
import Errors from '../components/errors.jsx'

const Words = () => {
    const { isModalVisible, showModal, handleOk, handleCancel } = useModal()
    const { words, page, total, fetch, remove, addWord } = useWords()
    const { create, handleWordInput, handleTransInput, word, translate, errors: createErrors, clearInputs, loading:loadingCreate } = useNewWord(successCreate)

    const enlargerRef = useRef(null)

    const firstRender = useRef(true)
    useEffect(()=>{
        if(words.length>0)firstRender.current = false;
    }, [words])

    function successCreate(data) {
        clearInputs()
        handleOk()
        enlargerRef.current.style.height = '135px'
        setTimeout(()=>{
            enlargerRef.current.style.display = 'none'
            enlargerRef.current.style.height = '0px'
            setTimeout(()=>{
                enlargerRef.current.style.display = 'block'
            }, 300)
            addWord(data)
        }, 400)
    }

    function handleChangePage(page) {
        firstRender.current = true;
        fetch({body: {page, pageSize: 5}})
    }

    function handleCreateWord() {
        create({body: {word, translate}})
    }

    return (
        <div style={{flexGrow: '1', position:'relative'}} >
            <Errors errors={createErrors}/>
            <div className="add-button" onClick={showModal}>
                {loadingCreate?<LoadingOutlined />:<>NEW</>}
            </div>
            <div className="add-button-back" onClick={showModal}>
                {loadingCreate?<LoadingOutlined />:<>NEW</>}
            </div>
            <Modal title="Новое слово" visible={isModalVisible} onOk={handleCreateWord} onCancel={handleCancel}>
                <Space direction="vertical">
                    <Input placeholder="Слово на английском" value={ word } onChange={ handleWordInput }/>
                    <Input placeholder="Перевод" value={ translate } onChange={ handleTransInput }/>
                </Space>
            </Modal>
            <div style={{overflow: 'auto'}}>
                <div className="enlarger" ref={enlargerRef}></div>
                {words.map(w=><Word firstRender = {firstRender} key={w.word.id} item={w} remove={remove}/>)}
            </div>
            <Pagination 
                defaultCurrent={1}
                pageSize={5}
                current={page} 
                total={total} 
                hideOnSinglePage={true}
                onChange={handleChangePage}
                style={{paddingTop: '1em'}}
            />
        </div>
    )
}

const Word = ({item, remove, firstRender}) => {
    const wordRef = useRef()
    const enlargerRef = useRef()
    function animateRemove() {
        firstRender.current = true;
        wordRef.current.classList.remove("animate__bounceInLeft")
        wordRef.current.classList.add("animate__backOutLeft")
        wordRef.current.style.height = '0px'
        wordRef.current.style.margin = '0px'
    }
    useEffect(()=>{
        wordRef.current.style.height = '125px'
        if(!firstRender.current){
            wordRef.current.classList.add("animate__bounceInLeft")
        }
    },[])
    const {word, translate, id} = item;
    return (
        <>
            <div className="enlarger" ref={enlargerRef}></div>
            <Card className="animate__animated height-transition" ref={wordRef} title={word?word.value:'???'} 
                extra={<WordMenu animateRemove = { animateRemove } id={id} remove={remove}/>} 
                style={{ minWidth: 300, marginTop: '1em' }}
            >
                {<p>{translate?translate.value:'???'}</p>}
            </Card>
        </>
    )
}

const WordMenu = ({remove, id, animateRemove}) => {
    console.log()
    function handleRemove() {
        animateRemove()
        setTimeout(()=>{
            remove({body:{id}})
        }, 900)
    }
    const menu = <Menu>
                    <Menu.Item key={1} icon={<DeleteOutlined />} onClick={handleRemove}>Выучил</Menu.Item>
                </Menu>
    return (
        <Dropdown overlay={menu}>
            <DownCircleOutlined style={{fontSize: '18px', color: '#1890ff'}}/>
        </Dropdown>
    )
}

export default Words