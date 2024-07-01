import React, { useEffect } from "react";
import { Spin, Empty, Carousel } from 'antd';
import { RootState } from "../../app/store/store";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGetOrdersQuery } from "../api/apiSlice";

import './news.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

type OrderedArrayRequest = {
    title: string;
    date: string;
    name: string;
    phone: string;
    login: string;
    photo: string;
}

const News: React.FC = () => {

    const { login } = useParams<{login: string}>()
    const {data, isError, isLoading, isSuccess, refetch} = useGetOrdersQuery(login);

    const resultArray = data as OrderedArrayRequest[];
    
    useEffect(() => {
        refetch();
    },[refetch]);

    const orderedArray = useSelector((state: RootState) => state.product.orderedArray);
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const isAdmin = useSelector((state: RootState) => state.auth.role);

    return (
        <div>
            <div className="news-wrapper">
                <div className="news-bg-wrapper">


                    <div className="news-inner">
                        <Carousel autoplay autoplaySpeed={5000} fade speed={1000}>
                            <div className="coffee">
                                <p>каждый <strong>восьмой</strong> кофе в подарок</p>
                                <span>для авторизованных пользователей приложения</span>
                            </div>
                            <div className="bakery">
                                <p>скидка <strong>30%</strong> на вчерашнюю выпечку</p>
                            </div>
                            <div className="order-cake">
                                <p><strong>торт на заказ</strong></p>
                                <span>для авторизованных пользователей приложения</span>
                            </div>
                        </Carousel>

                        {isAuth === false && (
                            <>
                                <Empty className="empty-basket"/>
                                <span className="empty-news-description">Пусто, авторизуйтесь.</span>
                            </>
                        )}

                        {(isAdmin === true && isAuth === true) && (
                            resultArray.map((el, index) => (
                                <div key={index} className="news-order-inner">
                                    <img src={require(`../../../../product-photos/${el.photo}`)} alt=""/>
                                    <div className="order-description">
                                        <p>{el.title}</p>
                                        <p className="order-in-progress"></p>
                                        <span></span>
                                    </div>
                                </div>
                            ))
                        )}

                        {(isAdmin === false && isAuth === true) && (
                            resultArray.map((el, index) => (
                                <div key={index} className="news-order-inner">
                                    <img src={require(`../../../../product-photos/${el.photo}`)} alt=""/>
                                    <div className="order-description">
                                        <p>{el.title}</p>
                                        <p className="order-in-progress">ЗАКАЗ В ОБРАБОТКЕ</p>
                                        <span>Пожалуйста, ожидайте звонок для подтверждения заказа.</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
export default News;