// import useModal from "antd/lib/modal/useModal";
import React, { useEffect, useState } from 'react'
import { Modal, Space } from "antd";
import useModal from 'antd/lib/modal/useModal';

const Errors = ({errors}) => {
    useEffect(()=>{
        if(!errors)return
        //CUSTOM MOLECULER ERROR
        if(errors.message){
          Modal.error({
            title: `Ошибка ${ errors.code }`,
            content: errors.message
          })
        }
        //VALIDATION ERRORS
        if(errors.data && Array.isArray(errors.data)){
          Modal.error({
            title: `Ошибка ${ errors.code }`,
            content: errors.data.map((e, i)=><Space key={e.message || i} direction="vertical">{e.message || 'Неизвестная ошибка...'}</Space>)
          })
        }
      }, [errors])
      return null
}

export default Errors