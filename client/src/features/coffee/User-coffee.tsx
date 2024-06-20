import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spin, Result } from 'antd';
import { CoffeeOutlined } from '@ant-design/icons';
import { useGetCoffeeQuery } from '../api/apiSlice';
import { RootState } from '../../app/store/store';

const UserCoffee: React.FC = () => {
    const { login } = useParams<{ login: string }>();
    const { data, isLoading, isSuccess, refetch } = useGetCoffeeQuery(login);
    const [activeCups, setActiveCups] = useState<boolean[]>(Array(8).fill(false));

    type CoffeeResponse = {
        coffee: number;
    }
    
    const coffee = data as CoffeeResponse;
    const needToGlow = coffee?.coffee || 0;
    const coffeeDiff = 8 - needToGlow; 
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => { 
        refetch(); 
    }, [refetch]);

    useEffect(() => {
        if (isSuccess && data) {
            const cupsArray = Array(8).fill(false).map((_, index) => index < needToGlow);
            setActiveCups(cupsArray);
        }
    }, [data, isSuccess, needToGlow]);

    return (
        <>
            {(isLoading) && (<Spin />)}
            {(isSuccess && isAuth) && (
                <div className='user-coffee'>
                    <h1>КОФЕ В ПОДАРОК</h1>
                    <p>Заказывая кофе по qr-коду, вы накапливаете счётчик чашек.</p>
                    <p>Каждая восьмая чашка кофе - <strong>бесплатно</strong>!</p>
                    <div className='coffee-cups'>
                        {activeCups.map((isActive, index) => (
                            <CoffeeOutlined key={index} className={isActive ? 'anticon glowing-cup' : ''}/>
                        ))}
                    </div>
                    {(activeCups[7] === true) 
                        ? <p className='diff-coffee-paragraph'>Вам доступен кофе в подарок!</p>
                        : <p className='diff-coffee-paragraph'>Чашек до подарочного кофе: <strong className='count-coffee'>{coffeeDiff}</strong></p>
                    }
                </div>
            )}
            {(isAuth === false && !isLoading) && (
                <Result status="403" title="403" subTitle="Простите, Вы не авторизованы и не можете зайти на эту страницу." />
            )}
        </>
    );
};
export default UserCoffee;

