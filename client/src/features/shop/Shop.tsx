import React, { useRef, useState } from "react";
import { Result, Empty, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../app/store/store";
import { RightOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import { deleteCake, increaseCount, decreaseCount } from "../api/productSlice";
import { setActiveBottom, clearBasketButton } from "../api/buttonSlice";

import './shop.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const Shop: React.FC = () => {
    
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const productArray = useSelector((state: RootState) => state.product.productArray);
    const counts = useSelector((state: RootState) => state.product.counts);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDeleteProduct = async (title: string) => {
        try{
            // удаляем корзинкой из "корзины"
            await dispatch(deleteCake( {title} ));
            
            // очищаем иконку в "дом"
            dispatch(clearBasketButton({ title }));
        }catch(error){
            console.error('Ошибка при удалении:', error);
        }
    }

    const handleIncrease = (title: string) => {
        dispatch(increaseCount({ title }));
    }
    const handleDecrease = (title: string) => {
        dispatch(decreaseCount({ title }));
    }
    return (
        <>  
            {(productArray.length === 0 && isAuth === true) && (
                <div className="empty-basket-wrapper">
                    <Empty className="empty-basket"/>
                    <span className="empty-basket-description">Корзина пуста, добавьте что-нибудь</span>
                    <Button type="primary" className="form-button" 
                        onClick={() => {
                            navigate('/home');
                            dispatch(setActiveBottom(2));
                        }}>
                        Выбрать торт
                    </Button>
                </div>
            )}

            {(isAuth === true && productArray.length !== 0) && (
                <div className="bascket-wrapper">
                    <h3>Корзина</h3>
                    
                    {productArray.map((el, index) => (
                        <div key={index} className="bascket-inner">
                            <img src={ process.env.NODE_ENV === 'production' 
                                    ? `${process.env.REACT_APP_PHOTOS_BASE_URL}/${el.photo}` 
                                    : require(`${process.env.REACT_APP_PHOTOS_BASE_URL}/${el.photo}`)
                                } alt=""
                            />
                            <div className="bascket-description">
                                <p>{el.title}</p>
                                <span>{counts[el.title] || 1}шт / {counts[el.title] || 1}кг</span>
                                <span className="bascket-price">
                                    ~{(el.price * 10) * counts[el.title] || 1} руб <DeleteOutlined onClick={() => handleDeleteProduct(el.title)}/>
                                </span>
                            </div>
                            <div>
                                <div className="count-buttons-wrapper">
                                    <Button className="count-button" onClick={() => handleDecrease(el.title)}>-</Button>
                                    {counts[el.title] || 1}
                                    <Button className="count-button" onClick={() => handleIncrease(el.title)}>+</Button>
                                </div>
                                <Link to={`/shop/${el.title}`}>
                                    <p className="order-link" ><strong>ЗАКАЗАТЬ</strong><RightOutlined className="right-arrow"/></p>
                                </Link>
                            </div>
                        </div>
                    ))}

                </div>
            )}
        
            {isAuth === false && (
                <Result status="403" subTitle="Авторизуйтесь, чтобы заказать торт." />
            )}
        </>
        
    )
}
export default Shop;