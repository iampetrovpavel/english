import React from 'react'
import { Menu  } from 'antd';
import { Link, useLocation } from "react-router-dom";
import {  UserOutlined, PaperClipOutlined, DatabaseOutlined, PlayCircleOutlined   } from '@ant-design/icons';
import { Layout  } from 'antd';
const { Header } = Layout;
import Wrapper from "./wrapper.jsx";
import logoImg from '../assets/imgs/logo.png'

const HeaderMenu = ({me, exit}) => {
    // const admin = me?me.groups.includes('admin'):false
    const location = useLocation()
    // const menu = [
    //     {link:'/words', name: 'Словарь'},
    //     {link:'/play', name: 'Тренировка'}
    // ]
    return (
        <Header style={{padding: 0}}>
            <Wrapper>
                {/* <div style={{width: '80px'}}>
                    <img src={logoImg} width="64" height="64" style={{padding: "4px 4px"}}/>
                </div> */}
            {me && <Menu theme="dark" mode="horizontal" defaultSelectedKeys={location.pathname} 
                style={{
                    // fontSize: '16px',
                    fontWeight: '800',                    
                    flexGrow: '1'
                }}>
                    <Menu.Item key="/words" icon={<PaperClipOutlined/>}><Link to="/words">REMEMBER</Link></Menu.Item>
                    <Menu.Item key="/play" icon={<PlayCircleOutlined />}><Link to="/play">LEARN</Link></Menu.Item>
                    <Menu.Item key="/dic" icon={<DatabaseOutlined />}><Link to="/dic">DICTIONARY</Link></Menu.Item>
                    <Menu.SubMenu key="sub1" icon={<UserOutlined />} title={me.name}>
                        <Menu.Item key="9" onClick={exit}>Выход</Menu.Item>
                    </Menu.SubMenu>
                </Menu>}
            </Wrapper>
        </Header>
    )
}

export default HeaderMenu