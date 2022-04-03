// import useModal from "antd/lib/modal/useModal";
import React, { useEffect, useState } from 'react'
import { Modal, Space } from "antd";
import useModal from 'antd/lib/modal/useModal';

const Errors = ({errors}) => {
    useEffect(()=>{
        if(!errors)return
        Modal.error({
          title: `Ошибка ${ errors.code }`,
          content: errors.data.map(e=><Space key={e.message} direction="vertical">{e.message}</Space>)
        })
      }, [errors])
      return null
}

export default Errors