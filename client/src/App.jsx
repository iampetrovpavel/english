import React from "react";
import 'antd/dist/antd.css';
import './App.css';
import 'animate.css'
import { Layout  } from 'antd';
const { Content } = Layout;
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Reg from "./pages/Reg.jsx";
import Words from "./pages/Words.jsx";
import Play from "./pages/Play.jsx";
import useMe from './hooks/useMe'
import Header from './components/header.jsx'
import Wrapper from "./components/wrapper.jsx";
import getProtectedRoute from './components/protected.jsx'
import Login from "./pages/Login.jsx";

const App = () => {
    const navigate = useNavigate()
    const { me, setMe, exit } = useMe(
        (data)=>{
            setMe(data)
        }, 
        ()=>{ navigate('/login') })
    return (
        <Layout style={{height: '100%', paddingBottom: '1em'}}>
            <Header me={me} exit={exit}/>
            <Content style={{height: '100%'}}>
                <Wrapper>
                    <Routes>
                        <Route path="/" element={<Navigate to="/words"/>}/>
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

export default App;