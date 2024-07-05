import React, { useEffect } from "react";
import { Spin, Empty, Carousel } from 'antd';
import { DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { RootState } from "../../app/store/store";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGetOrdersQuery, useDeleteOrderMutation } from "../api/apiSlice";
import { dropCakes, deleteCake } from "../api/productSlice";
import { clearBasketButton } from "../api/buttonSlice";

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
    count: number;
    time: string;
}

const News: React.FC = () => {

    const { login } = useParams<{login: string}>()
    const {data, isLoading, refetch} = useGetOrdersQuery(login);
    const [deleteOrder, {isSuccess}] = useDeleteOrderMutation();
    const dispatch = useDispatch();

    const resultArray = data as OrderedArrayRequest[] || [];

    const handleDeleteOrder = async (title: string, name: string) => {
        try{
            await deleteOrder({ title: title, name: name });
            refetch();
        }catch(error){
            console.error('Ошибка при удалении заказа:', error);
        }
    };
    
    useEffect(() => {
        refetch();
    },[refetch]);

    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const isAdmin = useSelector((state: RootState) => state.auth.role);

    return (
        <div>
            <div className="news-wrapper">
                <div className="news-bg-wrapper">


                    <div className="news-inner">
                        <div className="carousel-wrapper">
                            <Carousel autoplay autoplaySpeed={7000} speed={1000}>
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
                        </div>

                        {(isLoading) && (<Spin />)}

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
                                    <div className="order-description-admin">
                                        <p><strong>{el.title}</strong> ({el.count} шт.)</p>
                                        <p className="order-in-progress">{el.name}</p>
                                        <p>{el.phone}</p>
                                        <span>на {el.date.split('-').reverse().join('-')}</span>
                                        <span>к {el.time}</span>
                                    </div>
                                    <div className="order-buttons">
                                        <CheckCircleOutlined className="accept-order-button"/>
                                        <DeleteOutlined className="delete-order-button" onClick={() => handleDeleteOrder(el.title, el.name)}/>
                                    </div>
                                </div>
                            ))
                        )}

                        {(isAdmin === false && isAuth === true) && (
                            resultArray.map((el, index) => (
                                <div key={index} className="news-order-inner">
                                    <img src={require(`../../../../product-photos/${el.photo}`)} alt=""/>
                                    <div className="order-description">
                                        <p>{el.title} ({el.count} шт.)</p>
                                        <span>{el.date.split('-').reverse().join('-')} к {el.time}</span>
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