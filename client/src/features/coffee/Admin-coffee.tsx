import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { Button, Input, message, Result } from 'antd';
import { useAddCoffeeMutation } from '../api/apiSlice';

import './coffee.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'

const AdminCoffee: React.FC = () => {

    const [addCoffee, { data, isLoading, isError, isSuccess }] = useAddCoffeeMutation();

    const [number, setNumber] = useState('');
    const [selectCoffee, setSelectCoffee] = useState('');
    
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [messageApi, contextHolder] = message.useMessage();

    type UserLoginFromResponse = {
        userLogin: string;
    }
    const user = data as UserLoginFromResponse;
    
    const success = () => {
        messageApi.open({
            type: 'success',
            content: `Вы добавили клиенту '${user.userLogin}' кофе!`,
            duration: 5,
        });
    };
    
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Клиент с таким qr-кодом не найден!',
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
        try{
            await addCoffee({ number: number, selectedCoffee: selectCoffee});
            setNumber('');
            setSelectCoffee('');
        }catch (err){
            console.error('Ошибка входа: ', err);
        }
    };

    // отрисовка контента
    return (
        <>
            {(isAuth === true) && (
                <div className="admin-coffee">
                    {contextHolder}
                    <p>Введите в поле qr-код посетителя, введите количество чашек кофе для добавления и нажмите "Добавить".</p>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <Input 
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setNumber(e.target.value)} 
                                value={number} 
                                type="number" 
                                name="number" 
                                placeholder="Введите номер" 
                                required
                                max={9999}
                            />
                        </div>
                        <div>
                            <Input max={8}
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setSelectCoffee(e.target.value)}
                                value={selectCoffee}
                                type="number" 
                                name="selectCoffee" 
                                placeholder="Введите количество кофе" 
                                required 
                            />
                        </div>
                        <Button htmlType="submit" type="primary" className="form-button" disabled={isLoading}>Добавить</Button>
                    </form>
                </div>
            )}
            
            {isAuth === false && (
                <Result status="403" title="403" subTitle="Простите, Вы не авторизованы и не можете зайти на эту страницу." />
            )}
        </>
    )
}
export default AdminCoffee;