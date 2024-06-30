import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spin, Result } from 'antd';
import { useGetCoffeeQuery } from '../api/apiSlice';
import { RootState } from '../../app/store/store';
// import { webSocketConnected } from '../api/webSocketSlice';

import './coffee.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const UserCoffee: React.FC = () => {
    const { login } = useParams<{ login: string }>();
    const { data, isLoading, isSuccess, refetch } = useGetCoffeeQuery(login);
    const [activeCups, setActiveCups] = useState<boolean[]>(Array(8).fill(false));
    
    type CoffeeResponse = {
        coffee: number;
    }
    
    // const dispatch = useDispatch();
    // const messages = useSelector((state: RootState) => state.webSocket.messages);

    const coffee = data as CoffeeResponse;
    const needToGlow = coffee?.coffee || 0;
    const coffeeDiff = 7 - needToGlow; 
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
                            <img key={index} src={isActive ? require('./gifted-coffee.png') : require('./gifted-coffee-outlined.png')} alt=''/>
                        ))}
                    </div>
                    {(activeCups[7] === true) 
                        ? <p className='diff-coffee-paragraph'>Вам доступен <strong>кофе в подарок!</strong></p>
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

