import React, {useState} from "react";
import { Card, Button, Modal, Input, Space, Menu, Dropdown, Pagination} from 'antd';
import {DownCircleOutlined} from '@ant-design/icons'
import useModal from '../hooks/useModal'

const words = [
    {word: 'test', transes: ['проверка', 'проверка',]},
    {word: 'test', transes: ['проверка']},
]

const Words = () => {
    const {isModalVisible, showModal, handleOk, handleCancel} = useModal()
    return (
        <div style={{marginTop:'1em'}} >
            <div className="wods-menu">
                <Button type="primary" success onClick={showModal}>
                    Добавить
                </Button>
            </div>
            <Modal title="Новое слово" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Space direction="vertical">
                    <Input placeholder="Слово на английском" />
                    <Input placeholder="Перевод" />
                </Space>
            </Modal>
            {words.map(w=><Word item={w}/>)}
            <Pagination defaultCurrent={1} total={50} style={{paddingTop: '1em'}}/>
        </div>
    )
}

const Word = ({item}) => {
    const {word = '...', transes = []} = item;
    return (
        <Card size="small" title={word} extra={<a href="#"><More/></a>} style={{ width: 300, marginTop: '1em' }}>
            {transes.map(t=><p>{t}</p>)}
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