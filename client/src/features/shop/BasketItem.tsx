import React, { useState, useEffect } from "react";
import { Spin, Result, Button, Input, message } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Link, useParams  } from "react-router-dom";

import './shop.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const BasketItem: React.FC = () => {

    const { cakeTitle } = useParams<{cakeTitle: string}>();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const productArray = useSelector((state: RootState) => state.product.productArray);
    const product = productArray.find(el => el.title === cakeTitle)
    

    const [messageApi, contextHolder] = message.useMessage();
    
    // const success = () => {
    //     messageApi.open({
    //         type: 'success',
    //         content: `Вы добавили новую позицию в ленту продуктов!`,
    //         duration: 5,
    //     });
    // };
    // const error = () => {
    //     messageApi.open({
    //         type: 'error',
    //         content: 'Произошла ошибка! Не добавилось..',
    //         duration: 5,
    //     });
    // };
    // useEffect(() => {
    //     if (isSuccess) {
    //         success();
    //     }
    //     if (isError) {
    //         error();
    //     }
    // }, [isSuccess, isError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // await orderedCake({ title: title, name: name, phone: phone });
            setName('');
            setPhone('');
        } catch (err) {
            console.error('Ошибка при заказе:', err);
        }
    };

    return (
        <>  
            {isAuth === true && (
                <div className="bascket-item-wrapper">

                    <Button type="dashed" className="backward-button">
                        <Link to={'/shop'}><LeftOutlined /></Link>
                    </Button>

                    {contextHolder}

                    <div className="basket-item">
                        <h3>Оформление заказа</h3>
                        <p>на <strong>{product?.title}</strong></p>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <Input 
                                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setName(e.target.value) } 
                                    value={name} 
                                    type="text" 
                                    name="name" placeholder="Укажите Ваше имя" required
                                ></Input>
                            </div>
                            <div>
                                <Input 
                                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value) } 
                                    value={phone} 
                                    type="tel"
                                    name="phone" placeholder="Ваш телефон" required
                                ></Input>
                            </div>
                            <Button htmlType="submit" type="primary" className="form-button" 
                                // disabled={isLoading}
                            >Заказать</Button>
                        </form>
                    </div>
                </div>
            )}
        
            {isAuth === false && (
                <Result status="403" title="403" subTitle="Простите, Вы не авторизованы и не можете зайти на эту страницу." />
            )}
        </>
        
    )
}
export default BasketItem;