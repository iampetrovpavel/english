import React from "react";
import { Form, Input, Button, Space, Card } from 'antd';
import { Link } from "react-router-dom";
import useReg from '../hooks/useReg'
import { useNavigate } from 'react-router-dom'
import Loading from "../components/loading.jsx";
import Errors from "../components/errors.jsx";

const Reg = ({me, setMe}) => {
  const navigate = useNavigate()
  if(me) { navigate('/words') }

  const {email, handleEmail, password, handlePassword, name, handleName, reg, errors, loading} = useReg(setMe)

  return (
    <Card style={{ width: 320, margin:'0 auto', marginTop:'1em' }}>
      <Errors errors={ errors } />
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
        >
          <Input onChange={handleEmail} value={email}/>
        </Form.Item>

        <Form.Item
          label="Имя"
          name="name"
        >
          <Input onChange={handleName} value={name}/>
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          // rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password onChange={handlePassword} value={password}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Space direction="vertical">
            <Button type="primary" htmlType="submit" onClick={reg}>
              <Loading loading={ loading }>Зарегистрироваться</Loading>
            </Button>
            <Link to="/login">
              Вход
            </Link>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Reg