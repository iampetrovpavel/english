import React from "react";
import { Card, Button, Modal, Input, Space, Menu, Dropdown, Pagination} from 'antd';
import {DownCircleOutlined} from '@ant-design/icons'
import useModal from '../hooks/useModal'
import useWords from "../hooks/useWords";
import useNewWord from "../hooks/useNewWord";

const Words = () => {
    const { isModalVisible, showModal, handleOk, handleCancel } = useModal()
    const { words, page, total, fetch } = useWords()
    const { create, handleWordInput, handleTransInput, word, trans } = useNewWord(successCreate)

    function successCreate() {
        handleOk()
        fetch()
    }

    function handleChangePage(page) {
        fetch({body: {page}})
    }

    function handleCreateWord() {
        create({body: {word, trans:[trans]}})
    }

    return (
        <div style={{marginTop:'1em'}} >
            <div className="wods-menu">
                <Button type="primary" success="true" onClick={showModal}>
                    Добавить
                </Button>
            </div>
            <Modal title="Новое слово" visible={isModalVisible} onOk={handleCreateWord} onCancel={handleCancel}>
                <Space direction="vertical">
                    <Input placeholder="Слово на английском" value={ word } onChange={ handleWordInput }/>
                    <Input placeholder="Перевод" value={ trans } onChange={ handleTransInput }/>
                </Space>
            </Modal>
            {words.map(w=><Word key={w._id} item={w}/>)}
            <Pagination 
                defaultCurrent={1} 
                current={page} 
                total={total} 
                hideOnSinglePage={true}
                onChange={handleChangePage}
                style={{paddingTop: '1em'}}
            />
        </div>
    )
}

const Word = ({item}) => {
    const {word = '...', trans = []} = item;
    return (
        <Card size="small" title={word} extra={<a href="#"><More/></a>} style={{ width: 300, marginTop: '1em' }}>
            {trans.map(t=><p key={t}>{t}</p>)}
        </Card>
    )
}

const More = () => {
    const menu = <Menu>
                    <Menu.Item danger>Удалить</Menu.Item>
                </Menu>
    return (
        <Dropdown overlay={menu}>
            <DownCircleOutlined />
        </Dropdown>
    )
}

export default Words