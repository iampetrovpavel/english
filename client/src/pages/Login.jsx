import React from "react";
import { Form, Input, Button, Checkbox, Space, Card } from 'antd';
import { Link } from "react-router-dom";
import useLogin from '../hooks/useLogin'
import { Navigate } from 'react-router-dom'
import Errors from "../components/errors.jsx";
import Loading from "../components/loading.jsx";

const Login = ({me, setMe}) => {
  if(me) { return <Navigate to='/words' replace /> }
  const {email, handleEmail, password, handlePassword, login, errors, loading} = useLogin(setMe)
  return (
    <Card style={{ width: 300, margin:'0 auto', marginTop:'1em' }}>
      <Errors errors={errors}/>
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
          <Input onChange={handleEmail} value={email} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
        >
          <Input.Password onChange={handlePassword} value={password}/>
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Запомнить меня</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Space direction="vertical">
              <Button type="primary" htmlType="submit" onClick={login}>
                <Loading loading={ loading }>Войти</Loading>
              </Button>
              <Link to="/reg">
                Регистрация
              </Link>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login