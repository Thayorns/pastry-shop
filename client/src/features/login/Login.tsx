import React, { useEffect, useState } from "react";
import { Button, Input, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setActiveTop } from "../api/buttonSlice";
import { useLogInUserMutation } from "../api/apiSlice";
import { RootState } from "../../app/store/store";

import './login.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'


const Login: React.FC = () => {
    const [logInUser,{error}] = useLogInUserMutation();
    const dispatch = useDispatch();

    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const role = useSelector((state: RootState) => state.auth.role);
    const friend = useSelector((state: RootState) => state.auth.friend);
    const userLoginFromStore = useSelector((state:RootState) => state.auth.login)
    const loginStatus = useSelector((state: RootState) => state.auth.loginStatus);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await logInUser({ login: userName, password: userPassword});
        }catch (err){
            console.error('Ошибка входа: ', err);
        }
    };
    
    useEffect(() => {
        if (isAuth) {
            dispatch(setActiveTop(role ? 0 : 1));
        }
    }, [isAuth, role, dispatch]);
    
    const errorDisplay: React.ReactNode = error as React.ReactNode;

    return (
        <>
            {(loginStatus === 'loading') && (<Spin/>)}

            {(isAuth === true && role === true) && (
                <div className="admin-logged">
                    <h1>Администратор - <strong>{userLoginFromStore}</strong></h1>
                    <p>Для администраторов приложение несколько отличается своим расширенным функционалом, <strong>недоступным</strong> для клиентов.</p>
                    <p>В разделе "настройки" Вы можете добавлять в друзья клиентов, достаточно ввести его логин.</p>    
                    <p>В разделе "настройки" Вы можете наделять пользователя правами администратора. Будьте избирательны в своём решении.</p>   
                    <p>В разделе "настройки" Вы можете добавлять новые позиции продукции с фотографией, ценой, ингредиентами и описанием.</p>   
                    <p>В разделе "дом" Вы можете удалять продукты из ленты нажатием на "корзину".</p>   
                    <p>В разделе "кофе" Вы можете добавлять подарочные кофе для клиентов, достаточно ввести номер, который он озвучит.</p>
                    <p>В разделе "уведомления" Вы можете подтверждать или удалять заказы тортов от клиентов.</p>
                </div>
            )}

            {(isAuth === true && role === false) && (
                <div className="user-logged">

                    {friend === true ? (
                        <div className="user-friend-logged-wrapper">
                            <div className="user-friend-logged-inner">
                                <p>карта друга</p>
                                <h1>{userLoginFromStore}</h1>
                                <p>пекарни-кондитерской</p>
                                <h1>КРЕМ и КОРЖ</h1>
                                <p>скидка 15% на всю продукцию</p>
                            </div>
                        </div>
                    ) : (
                        <div className="user-logged-wrapper">
                            <h1>{userLoginFromStore}!</h1>
                            <p>Вы можете пользоваться проводимыми в "КРЕМ и КОРЖ" акциями, такими как бесплатный кофе.</p>
                            <p>Кликните на раздел "qr-код" для дальнейших инструкций.</p>
                        </div>
                        )
                    }
                    
                </div>
            )}

            {(isAuth === false) && (
                <div className="login-form">
                    <h1>ВХОД В АККАУНТ</h1>
                    
                    <span>Заполните форму, чтобы войти в свой аккаунт.</span>
                    
                    <span>Ещё не зарегистрировались? - <Link to={`/register`}><strong>РЕГИСТРАЦИЯ</strong></Link></span>
                    
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
            )}
        </>
    )
}
export default Login;