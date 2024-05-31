import React from "react";
import { Button, Input  } from 'antd';

import './register.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'

type FieldType = {
    email?: string;
    username?: string;
    password?: string;
};

const Register: React.FC = () => {
    return (
        <div className="register">
            <h1>АВТОРИЗАЦИЯ</h1>
            <span>Заполните форму, чтобы создать новый аккаунт.</span>
            
            <form>
                <div>
                    <Input type="email" name="email" placeholder="Укажите почту" required></Input>
                </div>
                <div>
                    <Input type="username" name="username" placeholder="Ваш логин" required></Input>
                </div>
                <div>
                    <Input type="password" name="password" placeholder="Пароль" required></Input>
                </div>
                <Button onClick={(e)=>{
                    // e.preventDefault()
                }} htmlType="submit" type="primary" className="form-button">Принять</Button>
            </form>
        </div>
    )
}
export default Register;