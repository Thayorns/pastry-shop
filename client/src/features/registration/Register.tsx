import React, { useState } from "react";
import { Button, Input, Spin, Result } from 'antd';
import { useAddUserMutation } from "../api/apiSlice";
import { LeftOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

import './register.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const Register: React.FC = () => {
    const [addUser, { isLoading, error, isSuccess }] = useAddUserMutation()
    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')
    
    // user register func
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await addUser({ email: userEmail, login: userName, password: userPassword})
        }catch(err){
            console.error('Ошибка регистрации: ', err);
        }
    }
    
    const errorDisplay: React.ReactNode = error as React.ReactNode;
    let content: React.ReactNode;
    
    if(isLoading){
        content = <Spin/>
    }else if(isSuccess){
        content = (
            <div className="success-register">
                <h2><strong>{userName}</strong></h2>
                <Result
                    status="success"
                    title=" Вы успешно зарегистрировались!"
                    subTitle="Активируйте свой аккаунт в течении 1 часа, чтобы использовать наши акции, например бесплатный кофе по qr-code."
                />
                <p>На почту <span className="email-underlined">{userEmail}</span> отправлено письмо с активацией аккаунта</p>
            </div>
        )
    }else{
        content = (
            <div className="register">
                
                <Button type="dashed" className="backward-button">
                    <Link to={'/login'}><LeftOutlined /></Link>
                </Button>
                
                <h1>РЕГИСТРАЦИЯ</h1>
                <span>Заполните форму, чтобы создать новый аккаунт в "КРЕМ и КОРЖ".</span>
                {errorDisplay && (
                    <div className="error-register">
                        <p>Ошибка регистрации.</p>
                        <p>Попробуйте снова.</p>
                    </div>
                ) as React.ReactNode}
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserEmail( e.target.value)} 
                            value={userEmail} 
                            type="email" 
                            name="email" placeholder="Укажите Вашу почту" required
                        ></Input>
                    </div>
                    <div>
                        <Input 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value) } 
                            value={userName} 
                            type="text" 
                            name="username" placeholder="Ваш логин" required
                        ></Input>
                    </div>
                    <div>
                        <Input 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value)} 
                            value={userPassword} minLength={8}
                            type="password" 
                            name="password" placeholder="Ваш пароль" required
                        ></Input>
                    </div>
                    <Button htmlType="submit" type="primary" className="form-button" disabled={isLoading}>Принять</Button>
                </form>
            </div>
        )
    }
    
    return content
};
export default Register;