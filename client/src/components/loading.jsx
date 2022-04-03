import React from 'react';
import loadingImg from '../assets/imgs/loading.gif'

const Loading = ({children, loading}) => {
    return loading?<img src={loadingImg} height="20" width="20"/>:children;
}

export default Loading