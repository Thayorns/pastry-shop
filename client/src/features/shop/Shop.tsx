import React, { useRef, useState } from "react";
import { Result, Empty, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../app/store/store";
import { RightOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import { deleteCake, increaseCount } from "../api/productSlice";
import { setActiveBottom, clearBasketButton } from "../api/buttonSlice";

import './shop.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const Shop: React.FC = () => {
    
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const productArray = useSelector((state: RootState) => state.product.productArray);
    // Создаем массив состояний для каждого элемента в корзине
    const [counts, setCounts] = useState<number[]>(productArray.map(() => 1));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const increaseButton = (index: number) => {
        setCounts(prev => {
            const newCount = [...prev];
            newCount[index] += 1;
            return newCount;
        });
    };
    const decreaseButton = (index: number) => {
        setCounts(prev => {
            const newCount = [...prev];
            newCount[index] = newCount[index] === 1 ? 1 : newCount[index] - 1;
            return newCount;
        });
    };

    const handleOrderRenewed = (num: number) => {
        dispatch(increaseCount({ count: counts[num] } ));
    };

    const handleDeleteProduct = async (title: string) => {
        try{
            await dispatch(deleteCake( {title} ));
            dispatch(clearBasketButton({ title }));
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
                                <span>{counts[index]}шт / {counts[index]}кг</span>
                                <span className="bascket-price">
                                    ~{(el.price * 10) * counts[index]} руб <DeleteOutlined onClick={() => handleDeleteProduct(el.title)}/>
                                </span>
                            </div>
                            <div>
                                <div className="count-buttons-wrapper">
                                    <Button className="count-button" onClick={() => decreaseButton(index)}>-</Button>
                                    {counts[index]}
                                    <Button className="count-button" onClick={() => increaseButton(index)}>+</Button>
                                </div>
                                <Link to={`/shop/${el.title}`}>
                                    <p className="order-link" 
                                        onClick={() => handleOrderRenewed(index)}
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