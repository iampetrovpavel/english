import React from 'react'
import { Route } from "react-router-dom";
import Login from "../pages/Login.jsx";

const getProtectedRoute = (path, Component, user) => {
    if (!user) {
        return <Route exact path='login' element={<Login/>} />
    }
    
    return <Route exact path={path} element={<Component/>} />;
}

export default getProtectedRoute;