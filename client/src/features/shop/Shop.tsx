import React, { useEffect, useState } from "react";
import { Spin, Result, Empty, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../app/store/store";
import { RightOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import { deleteCake, increaseCount } from "../api/productSlice";
import { setActiveBottom } from "../api/buttonSlice";

import './shop.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const Shop: React.FC = () => {

    const [count, setCount] = useState(1);

    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const productArray = useSelector((state: RootState) => state.product.productArray);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const increaseButton = () => {
        setCount(prev => prev + 1);
    };
    const decreaseButton = () => {
        setCount(prev => prev === 1 ? 1 : prev - 1);
    };

    const handleOrderRenewed = (num: number) => {
        dispatch(increaseCount({ count }));
    };

    const handleDeleteProduct = async (title: string) => {
        try{
            await dispatch(deleteCake( {title} ));
        }catch(error){
            console.error('Ошибка при удалении:', error);
        }
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
                            <img src={require(`../../../../product-photos/${el.photo}`)} alt=""/>
                            <div className="bascket-description">
                                <p>{el.title}</p>
                                <span>{count}шт / {count}кг</span>
                                <span className="bascket-price">
                                    ~{(el.price * 10) * count} руб <DeleteOutlined onClick={() => handleDeleteProduct(el.title)}/>
                                </span>
                            </div>
                            <div>
                                <div className="count-buttons-wrapper">
                                    <Button className="count-button" onClick={decreaseButton}>-</Button>
                                    {count}
                                    <Button className="count-button" onClick={increaseButton}>+</Button>
                                </div>
                                <Link to={`/shop/${el.title}`}>
                                    <p className="order-link" 
                                        onClick={() => handleOrderRenewed(count)}
                                        ><strong>ЗАКАЗАТЬ</strong><RightOutlined className="right-arrow"/>
                                    </p>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        
            {isAuth === false && (
                <Result status="403" title="403" subTitle="Простите, Вы не авторизованы и не можете зайти на эту страницу." />
            )}
        </>
        
    )
}
export default Shop;