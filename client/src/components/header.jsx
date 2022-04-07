import React from 'react'
import { Menu  } from 'antd';
import { Link, useLocation } from "react-router-dom";
import {  UserOutlined   } from '@ant-design/icons';
import { Layout  } from 'antd';
const { Header } = Layout;
import Wrapper from "./wrapper.jsx";

const HeaderMenu = ({me, exit}) => {
    const location = useLocation()
    const menu = [
        {link:'/words', name: 'Словарь'},
        {link:'/play', name: 'Тренировка'}
    ]
    return (
        <Header style={{padding: 0}}>
            <Wrapper>
                {me && <Menu theme="dark" mode="horizontal" defaultSelectedKeys={location.pathname}>
                    <Menu.Item key="/words"><Link to="/words">Словарь</Link></Menu.Item>
                    <Menu.Item key="/play"><Link to="/play">Тренировка</Link></Menu.Item>
                    <Menu.SubMenu key="sub1" icon={<UserOutlined />} title={me.name}>
                        <Menu.Item key="9" onClick={exit}>Выход</Menu.Item>
                    </Menu.SubMenu>
                </Menu>}
            </Wrapper>
        </Header>
    )
}

export default HeaderMenu