import React, { useEffect, useState } from "react";
import { Spin, Result, Button, Input, message } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { Link } from "react-router-dom";
import { useAddFriendMutation } from "../api/apiSlice";

import './settings.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const AddFriend: React.FC = () => {
    const [addFriend, {isError, isSuccess, isLoading}] = useAddFriendMutation();
    const [userLogin, setUserLogin] = useState('');
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [messageApi, contextHolder] = message.useMessage();
    
    const success = () => {
        messageApi.open({
            type: 'success',
            content: `Вы добавили нового друга!`,
            duration: 5,
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Произошла ошибка! Не добавилось..',
            duration: 5,
        });
    };
    useEffect(() => {
        if (isSuccess) {
            success();
        }
        if (isError) {
            error();
        }
    }, [isSuccess, isError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addFriend({ login: userLogin });
            setUserLogin('');
        } catch (err) {
            console.error('Ошибка при добавлении пользователя:', err);
        }
    };

    return (
        <>
            {isLoading && (<Spin/>)}

            {isAuth === true && (
                <div className="add-settings-div">
                    {contextHolder}
                    <Button type="dashed" className="backward-button">
                        <Link to={'/admin-settings'}><LeftOutlined /></Link>
                    </Button>
                    <p>Заполните форму, чтобы добавить пользователя в друзья.</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div>
                            <Input 
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserLogin(e.target.value) } 
                                value={userLogin} 
                                type="text" 
                                name="login" placeholder="Введите логин пользователя" required
                            ></Input>
                        </div>
                        <Button htmlType="submit" type="primary" className="form-button" disabled={isLoading}>Добавить</Button>
                            
                    </form>
                </div>
            )}
        
            {isAuth === false && (
                <Result status="403" subTitle="Простите, Вы не авторизованы и не можете зайти на эту страницу." />
            )}
        </>
        
    )
}
export default AddFriend;