import React, { useState } from "react";
import { Button, Input, Spin } from 'antd';
import { useLogInUserMutation, useUserLogoutMutation } from "../api/apiSlice";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../api/authSlice";

import './login.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'


const Login: React.FC = () => {
    const [logInUser] = useLogInUserMutation();
    const [userLogout] = useUserLogoutMutation();
    const dispatch = useDispatch();

    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const userLoginFromStore = useSelector((state:any) => state.auth.login)
    const loginStatus = useSelector((state: any) => state.auth.loginStatus);
    const error = useSelector((state: any) => state.auth.error);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        logInUser({ login: userName, password: userPassword})
    }
    const handleUserLogoutSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        userLogout({});
        dispatch(logout());
    }

    const errorDisplay: React.ReactNode = error as React.ReactNode;
    let content: React.ReactNode;
    
    if(loginStatus === 'loading'){
        content = <Spin/>
    }else if(isAuthenticated){
        content = (
            <div className="success-register">
                <h2>Здравствуйте, <strong>{userLoginFromStore}</strong>! Вы вошли в аккаунт "Крем и Корж"</h2>
                <p>Теперь Вы можете пользоваться акцией "бесплатного кофе", зайдя во вкладку "qr-кода" приложения.</p>
                <Link to='/'><Button onSubmit={handleUserLogoutSubmit} htmlType="submit" type="primary" className="form-button" >Выйти</Button></Link>
            </div>
        )
    }else{
        content = (
        
            <div className="login-div">
                <h1>АВТОРИЗАЦИЯ</h1>
                <span>Если Вы уже регистрировались в "Крем и Корж", заполните форму, чтобы войти в свой аккаунт.</span>
                {errorDisplay && (
                    <div className="error-register">
                        <p>Ошибка..Вы ввели неверный логин или пароль.</p>
                        <p>Попробуйте снова.</p>
                    </div>
                ) as React.ReactNode}
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} 
                            value={userName} 
                            type="text" 
                            name="username" 
                            placeholder="Ваш логин" 
                            required 
                        />
                    </div>
                    <div>
                        <Input 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value)} 
                            value={userPassword} 
                            type="password" 
                            name="password" 
                            placeholder="Ваш пароль" 
                            required 
                        />
                    </div>
                    <Button htmlType="submit" type="primary" className="form-button" disabled={loginStatus === 'loading'}>Войти</Button>
                </form>
            </div>
        )
    }
    return content
}
export default Login;