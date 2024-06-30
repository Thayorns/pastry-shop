import React from "react";
import { Spin, Result } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { RightOutlined } from '@ant-design/icons';

import './shop.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const Shop: React.FC = () => {

    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const productArray = useSelector((state: RootState) => state.product.productArray);    

    return (
        <>  
            {isAuth === true && (
                <div className="bascket-wrapper">
                    <h3>Корзина</h3>
                    {productArray.map((el, index) => (
                        <div key={index} className="bascket-inner">
                            <img src={require(`../../../../product-photos/${el.photo}`)} alt=""/>
                            <p>{el.title}</p>
                            {/* <span>{el.price} руб.</span> */}
                            <p className="order-link"><strong>ЗАКАЗАТЬ</strong><RightOutlined className="right-arrow"/></p>
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