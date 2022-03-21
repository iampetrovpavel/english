import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import './App.css';
import { Layout, Menu  } from 'antd';
import {  UserOutlined   } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
import { Route, Routes, Link, Navigate, Router, useNavigate} from "react-router-dom";
import Reg from "./pages/Reg.jsx";
import Login from "./pages/Login.jsx";
import Words from "./pages/Words.jsx";
import Play from "./pages/Play.jsx";
import useMe from './hooks/useMe'

const App = () => {
    const { me, setMe, exit } = useMe()
    const navigate = useNavigate();
    useEffect(()=>{
        if(me){
            navigate('/')
        }
    }, [me])
    const RequireAuth = ({children})=>(me?children:<Navigate to="/login"/>)
    return (
        <Layout style={{height: '100%', paddingBottom: '1em'}}>
            <Header style={{padding: 0}}>
                <Wrapper>
                    {me && <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1"><Link to="/words">Словарь</Link></Menu.Item>
                        <Menu.Item key="2"><Link to="/play">Тренировка</Link></Menu.Item>
                        <Menu.SubMenu key="sub1" icon={<UserOutlined />} title={me.name}>
                            <Menu.Item key="9" onClick={exit}>Выход</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>}
                </Wrapper>
            </Header>
            <Content style={{height: '100%'}}>
                <Wrapper>
                    <Routes>
                        <Route path="/" element={<Navigate to="/words"/>}/>
                        <Route path="reg" element={<Reg setMe={setMe}/>} />
                        <Route path="login" element={<Login setMe={setMe}/>}/>
                        <Route path="play" element={<RequireAuth><Play /></RequireAuth>} />
                        <Route path="words" element={<RequireAuth><Words /></RequireAuth>} />
                    </Routes>
                </Wrapper>
            </Content>
        </Layout>
    )
}

const Wrapper = ({children}) => (
    <div style={{maxWidth: '1024px', margin: '0 auto', height:'100%', padding: '0 1em', position: 'relative'}}>
        {children}
    </div>
)

export default App;