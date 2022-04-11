import React, { useEffect } from "react";
import { Card, Menu, Dropdown, Pagination} from 'antd';
import {DownCircleOutlined} from '@ant-design/icons'
import useDic from "../hooks/useDictionary";
import Errors from '../components/errors.jsx'
import useTranslates from "../hooks/useTranslates";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const Dic = ({me}) => {
    const admin = me.groups.includes('admin')
    const { words, page, total, fetch, remove, check } = useDic({
        body: !admin?{query:{checked:true}}:{}
    })
    const { translates, fetch:fetchTranslates, remove: removeTranslate, check: checkTranslate } = useTranslates()
    useEffect(()=>{
        if(words && words.length > 0) {
            fetchTranslates({body: {_id: [ words.map(w=>w.id) ]}})
        }
    }, [words])

    const paginationProps = {
        defaultCurrent: 1,
        pageSize: 5,
        current: page,
        total: total,
        hideOnSinglePage: true,
        onChange: handleChangePage,
    }
    const wordProps = {
        removeTranslate,
        admin, 
        remove,
        check,
        checkTranslate,
    }

    function getTranslates(word) {
        const result = translates.filter( translate=>translate.wordId == word.id )
        if(admin) return result
        return result.filter(t=>t.checked===true)
    }

    function handleChangePage(page) {
        fetch({body: {page, pageSize: 5}})
    }

    return (
        <div style={{marginTop:'1em', flexGrow: '1'}} >
            {words.map(w=><Word key={ w.id } item={ w } translates = { getTranslates(w) } { ...wordProps }/>)}
            <Pagination { ...paginationProps } style={{ paddingTop: '1em' }}/>
        </div>
    )
}

const Word = ({ item, remove, translates, admin, removeTranslate, check, checkTranslate }) => {
    const { value, id } = item;
    const canRemove = translates.length === 0;
    const checked = item.checked;
    if(!admin && translates.length === 0)return null;
    return (
        <Card size="small" style={{ minWidth: 300, marginTop: '1em' }}>
            <div style={{display:'flex', justifyContent: 'space-between'}}>
                { value || '???' }
                { admin &&
                    <div>
                        { checked ? <CheckOutlined style={{color:'green'}}/>:<CloseOutlined style={{color:'red'}}/>}
                        { (!checked || canRemove) && <WordMenu 
                            check={ check } 
                            id={ id } 
                            remove={ remove } 
                            canRemove={ canRemove }
                            checked = { checked }
                            style = {{ marginLeft: '1em'}}
                        /> }
                    </div>
                }
            </div>
            <hr/>
            { translates.map(t=>(
                <div key={t.id} style={{display:'flex', justifyContent: 'space-between'}}>
                    { t.value }
                    { admin && 
                    <div>
                        { t.checked ? <CheckOutlined style={{color:'green'}}/>:<CloseOutlined style={{color:'red'}}/>}
                        { <TranslateMenu checked = {t.checked} checkTranslate = { checkTranslate } style = {{ marginLeft: '1em'}} removeTranslate = { removeTranslate } id = { t.id }/> }
                    </div>
                    }
                </div>
            )) }
        </Card>
    )
}

const TranslateMenu = ({ removeTranslate, id, style, checkTranslate, checked })=>{
    function handleCheck() {
        checkTranslate({
            body: {id, checked: true}
        })
    }
    const menu = <Menu>
                    { !checked && <Menu.Item key={1} onClick={ handleCheck }>Подтверждаю</Menu.Item> }
                    <Menu.Item key={2} danger onClick={()=>removeTranslate({body:{id}})}>Удалить</Menu.Item>
                </Menu>
    return (
        <span style={style}>
            <Dropdown overlay={ menu }>
                <DownCircleOutlined />
            </Dropdown>
        </span>
    )
}

const WordMenu = ({remove, id, canRemove, check, checked, style}) => {
    function handleRemove() {
        remove({body:{id}})
    }
    function handleCheck() {
        check({
            body: {id, checked: true}
        })
    }
    const menu = <Menu>
                    { !checked && <Menu.Item key={1} onClick={ handleCheck }>Подтверждаю</Menu.Item> }
                    { canRemove && <Menu.Item key={2} danger onClick={handleRemove}>Удалить</Menu.Item> }
                </Menu>
    return (
        <span style={style}>
            <Dropdown overlay={menu}>
                <DownCircleOutlined />
            </Dropdown>
        </span>
    )
}

export default Dic