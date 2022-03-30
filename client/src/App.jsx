import React from "react";
import 'antd/dist/antd.css';
import './App.css';
import 'animate.css'
import { Layout, Menu  } from 'antd';
import {  UserOutlined   } from '@ant-design/icons';
const { Header, Content } = Layout;
import { Route, Routes, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import Reg from "./pages/Reg.jsx";
import Login from "./pages/Login.jsx";
import Words from "./pages/Words.jsx";
import Play from "./pages/Play.jsx";
import useMe from './hooks/useMe'

const App = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { me, setMe, exit } = useMe(
        (data)=>{
            setMe(data)
        }, 
        ()=>{ navigate('/login') })
    console.log("!!!!!!", location)
    const menu = [
        {link:'/words', name: 'Словарь'},
        {link:'/play', name: 'Тренировка'}
    ]
    return (
        <Layout style={{height: '100%', paddingBottom: '1em'}}>
            <Header style={{padding: 0}}>
                <Wrapper>
                    {me && <Menu theme="dark" mode="horizontal" defaultSelectedKeys={1}>
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
                        {/* <Route path="/" element={<Navigate to="/words"/>}/> */}
                        <Route path="reg" element={<Reg me={me} setMe={setMe}/>} />
                        <Route path="login" element={<Login me={me} setMe={setMe}/>}/>
                        { getProtectedRoute('words', Words, me) }
                        { getProtectedRoute('play', Play, me) }
                    </Routes>
                </Wrapper>
            </Content>
        </Layout>
    )
}

function getProtectedRoute(path, Component, user) {
    if (!user) {
        return <Route exact path='login' element={<Login/>} />
    }
    
    return <Route exact path={path} element={<Component/>} />;
}

const Wrapper = ({children}) => (
    <div style={{maxWidth: '1024px', margin: '0 auto', height:'100%', padding: '0 1em', position: 'relative', overflow:'hidden'}}>
        {children}
    </div>
)

export default App;