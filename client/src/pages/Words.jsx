import React from "react";
import { Card, Button, Modal, Input, Space, Menu, Dropdown, Pagination} from 'antd';
import {DownCircleOutlined} from '@ant-design/icons'
import useModal from '../hooks/useModal'
import useWords from "../hooks/useWords";
import useNewWord from "../hooks/useNewWord";
import Errors from '../components/errors.jsx'

const Words = () => {
    const { isModalVisible, showModal, handleOk, handleCancel } = useModal()
    const { words, page, total, fetch, remove, addWord } = useWords()
    const { create, handleWordInput, handleTransInput, word, translate, errors: createErrors } = useNewWord(successCreate)

    function successCreate(data) {
        handleOk()
        addWord(data)
        // fetch()
    }

    function handleChangePage(page) {
        fetch({body: {page, pageSize: 5}})
    }

    function handleCreateWord() {
        create({body: {word, translate}})
    }

    return (
        <div style={{marginTop:'1em'}} >
            <Errors errors={createErrors}/>
            <div className="wods-menu">
                <Button type="primary" success="true" onClick={showModal}>
                    Добавить
                </Button>
            </div>
            <Modal title="Новое слово" visible={isModalVisible} onOk={handleCreateWord} onCancel={handleCancel}>
                <Space direction="vertical">
                    <Input placeholder="Слово на английском" value={ word } onChange={ handleWordInput }/>
                    <Input placeholder="Перевод" value={ translate } onChange={ handleTransInput }/>
                </Space>
            </Modal>
            {words.map(w=><Word key={w.word.id} item={w} remove={remove}/>)}
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

const Word = ({item, remove}) => {
    const {word, translate, id} = item;
    return (
        <Card size="small" title={word?word.value:'???'} extra={<More id={id} remove={remove}/>} style={{ minWidth: 300, marginTop: '1em' }}>
            {<p>{translate?translate.value:'???'}</p>}
        </Card>
    )
}

const More = ({remove, id}) => {
    function handleRemove() {
        remove({body:{id}})
    }
    const menu = <Menu>
                    <Menu.Item key={1} danger onClick={handleRemove}>Удалить</Menu.Item>
                </Menu>
    return (
        <Dropdown overlay={menu}>
            <DownCircleOutlined />
        </Dropdown>
    )
}

export default Words