import React, { useState } from "react";
import { Button, Input, Spin } from 'antd';
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../api/authSlice";
import { useLogInUserMutation, useUserLogoutMutation } from "../api/apiSlice";
import { RootState } from "../../app/store/store";

import './login.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'


const Login: React.FC = () => {
    const [logInUser,{error}] = useLogInUserMutation();
    const [userLogout] = useUserLogoutMutation();
    const dispatch = useDispatch();

    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');

    // const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const role = useSelector((state: RootState) => state.auth.role);
    const userLoginFromStore = useSelector((state:RootState) => state.auth.login)
    const loginStatus = useSelector((state: RootState) => state.auth.loginStatus);
    
    // функция аутентификации + логин
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await logInUser({ login: userName, password: userPassword});
        }catch (err){
            console.error('Ошибка входа: ', err);
        }
    }
    
    // функция выхода из аккаунта
    const handleUserLogoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await userLogout({});
            dispatch(logout());
        }catch (err){
            console.error('Ошибка входа: ', err);
        }
    }
    
    // отрисовка контента
    const errorDisplay: React.ReactNode = error as React.ReactNode;
    let content: React.ReactNode;
    
    if(loginStatus === 'loading'){
        content = <Spin/>
    }else if(isAuthenticated === true && role === true){
        content = (
            <div className="success-login">
                <h1 className="admin-role">
                    АДМИНИСТРАТОР <br/>
                    {userLoginFromStore}
                </h1>
                <h2 className="success-login-h2">Здравствуйте! Вы вошли в аккаунт "КРЕМ и КОРЖ".</h2>
                <p>Для администраторов приложение несколько отличается своим расширенным функционалом, в отличии от остальных пользователей.</p>
                <p>В разделе "настройки" Вы можете добавлять в друзья посетителей, достаточно ввести логин посетителя.</p>    
                <p>В разделе "настройки" Вы можете добавлять пользователя в администраторы.</p>   
                <p>В разделе "настройки" Вы в будущем сможете загружать фотографии для раздела "дом".</p>   
                <p>В разделе "кофе" Вы можете добавлять подарочные кофе для пользователей, достаточно ввести номер, который озвучит посетитель.</p>
                <Link to='/login' className="account-logout-button"><Button onClick={handleUserLogoutSubmit} htmlType="submit" type="primary" className="form-button" >Выйти</Button></Link>
            </div>
        )
    }else if(isAuthenticated === true && role === false){
        content = (
            <div className="success-login-not-admin">
                <h1 className="success-login-h1">{userLoginFromStore}</h1>
                <h2 className="success-login-h2">Здравствуйте! Вы вошли в аккаунт "КРЕМ и КОРЖ".</h2>
                <p>Теперь Вы можете пользоваться проводимыми в "Крем и Корж" акциями, такими как бесплатный кофе.</p>
                <p>Кликните на раздел "qr-код" для дальнейших инструкций.</p>
                <Link to='/login' className="account-logout-button"><Button onClick={handleUserLogoutSubmit} htmlType="submit" type="primary" className="form-button" >Выйти</Button></Link>
            </div>
        )
    }else{
        content = (
            <div className="login-div">
                <h1>ВХОД В АККАУНТ</h1>
                <span>Если Вы уже регистрировались в "КРЕМ и КОРЖ", заполните форму, чтобы войти в свой аккаунт.</span>
                {errorDisplay && (
                    <div className="error-register">
                        <p>Ошибка..Вы либо ввели неверный логин или пароль, либо не активировали аккаунт через письмо на почте.</p>
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