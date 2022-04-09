import React from 'react'
import { Menu  } from 'antd';
import { Link, useLocation } from "react-router-dom";
import {  UserOutlined   } from '@ant-design/icons';
import { Layout  } from 'antd';
const { Header } = Layout;
import Wrapper from "./wrapper.jsx";
import logoImg from '../assets/imgs/logo.png'

const HeaderMenu = ({me, exit}) => {
    const location = useLocation()
    const menu = [
        {link:'/words', name: 'Словарь'},
        {link:'/play', name: 'Тренировка'}
    ]
    return (
        <Header style={{padding: 0}}>
            <Wrapper>
                <div style={{width: '80px'}}>
                    <img src={logoImg} width="64" height="64" style={{padding: "4px 4px"}}/>
                </div>
            {me && <Menu theme="dark" mode="horizontal" defaultSelectedKeys={location.pathname} 
                style={{
                    // minWidth:'300px', 
                flexGrow: '1'
            }}
            >
                    <Menu.Item key="/words"><Link to="/words">To learn</Link></Menu.Item>
                    <Menu.Item key="/play"><Link to="/play">Play</Link></Menu.Item>
                    {/* <Menu.Item key="/dictionary"><Link to="/dictionary">Dictionary</Link></Menu.Item> */}
                    <Menu.SubMenu key="sub1" icon={<UserOutlined />} title={me.name}>
                        <Menu.Item key="9" onClick={exit}>Выход</Menu.Item>
                    </Menu.SubMenu>
                </Menu>}
            </Wrapper>
        </Header>
    )
}

export default HeaderMenu