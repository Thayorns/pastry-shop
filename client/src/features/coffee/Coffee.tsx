import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { Button, Input, message } from 'antd';
import { useAddCoffeeMutation } from '../api/apiSlice';
import { CoffeeOutlined } from '@ant-design/icons';

import './coffee.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'

const Coffee: React.FC = () => {

    const [addCoffee, { data, isLoading, isError, isSuccess }] = useAddCoffeeMutation();

    const [number, setNumber] = useState('');
    const [selectCoffee, setSelectCoffee] = useState('');

    const coffee = useSelector((state: RootState) => state.auth.coffee);
    const role = useSelector((state: RootState) => state.auth.role);
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [messageApi, contextHolder] = message.useMessage();

    // console.log('coffee ==',coffee);
    let coffeeDiff = 8 - coffee

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
            {(role === true && isAuth === true) && (
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
            {(role === false && isAuth === true ) && (
                <div className='user-coffee'>
                    <h1>КОФЕ В ПОДАРОК</h1>
                    <p>Заказывая кофе по qr-коду, вы накапливаете счётчик чашек. </p>
                    <p>Каждая восьмая чашка кофе - <strong>бесплатно</strong>!</p>
                    <div className='coffee-cups'>
                        {[1,2,3,4,5,6,7].map((icon) => (<CoffeeOutlined key={icon}/>))}
                    </div>
                    <CoffeeOutlined className='EIGHT-coffee'/>
                    <p>Чашек до подарочного кофе: <strong className='count-coffee'>{coffeeDiff}</strong></p>

                </div>
            )}
            {isAuth === false && (
                <div className='auth-error'>
                    <h2>Пожалуйста, войдите в свой аккаунт, и Вам будет доступна акция подарочного кофе по qr-коду, возможность стать другом "КРЕМ и КОРЖ" и 15% скидкой на всю продукцию.</h2>
                </div>
            )}
        </>
    )
}
export default Coffee;