import React from "react";
import { useGetProductsQuery } from "../api/apiSlice";
import { Spin, Result } from 'antd';

import './home.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'

const Home: React.FC = () => {
    const {data, isError, isFetching, isSuccess, isLoading} = useGetProductsQuery({})
    interface ResultResponse {
        chapter: string;
        description: string;
        ingredients: string;
        photo: string;
        price: number;
        title: string;
    }
    const result = data as ResultResponse[] || [];

    const horizonAnchors = ['Торты', 'Выпечка', 'Десерты', 'Напитки', 'Сендвичи', 'Салаты'];

    const chapterCake = result.filter(obj => obj.chapter === 'Торты');
    const chapterBakery = result.filter(obj => obj.chapter === 'Выпечка');
    const chapterDesserts = result.filter(obj => obj.chapter === 'Десерты');
    const chapterDrinks = result.filter(obj => obj.chapter === 'Напитки');
    const chapterSandwitches = result.filter(obj => obj.chapter === 'Сендвичи');
    const chapterSalads = result.filter(obj => obj.chapter === 'Салаты');

    return (
        <>
            {isLoading && (<Spin/>)}
            
            {isSuccess && (
                <div className="home-div">
                    <div className="horizontal-filter">
                        {horizonAnchors.map((anchor, index) => 
                            <span key={index} className="horizon-anchors">{anchor}</span>
                        )}
                    </div>
                    <div className="product-cards">
                        <div>
                            <h3>Торты</h3>
                            {chapterCake.map((obj, index) => (
                                <div>
                                    <img key={index} src={require(`../../../../product-photos/${obj.photo}`)} alt=""/>
                                    <span>{obj.title} {obj.price} руб.</span>
                                </div>    
                            )
                            )}
                        </div>
                        <div>
                            <h3>Выпечка</h3>
                            {chapterBakery.map((obj, index) => (
                                <div>
                                    <img key={index} src={require(`../../../../product-photos/${obj.photo}`)} alt=""/>
                                    <span>{obj.title} {obj.price} руб.</span>
                                </div>    
                            )
                            )}
                        </div>
                        <div>
                            <h3>Десерты</h3>
                            {chapterDesserts.map((obj, index) => (
                                <div>
                                    <img key={index} src={require(`../../../../product-photos/${obj.photo}`)} alt=""/>
                                    <span>{obj.title} {obj.price} руб.</span>
                                </div>    
                            )
                            )}
                        </div>
                        <div>
                            <h3>Напитки</h3>
                            {chapterDrinks.map((obj, index) => (
                                <div>
                                    <img key={index} src={require(`../../../../product-photos/${obj.photo}`)} alt=""/>
                                    <span>{obj.title} {obj.price} руб.</span>
                                </div>    
                            )
                            )}
                        </div>
                        <div>
                            <h3>Сендвичи</h3>
                            {chapterSandwitches.map((obj, index) => (
                                <div>
                                    <img key={index} src={require(`../../../../product-photos/${obj.photo}`)} alt=""/>
                                    <span>{obj.title} {obj.price} руб.</span>
                                </div>    
                            )
                            )}
                        </div>
                        <div>
                            <h3>Салаты</h3>
                            {chapterSalads.map((obj, index) => (
                                <div>
                                    <img key={index} src={require(`../../../../product-photos/${obj.photo}`)} alt=""/>
                                    <span>{obj.title} {obj.price} руб.</span>
                                </div>    
                            )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isError && (
                <Result status="500" title="Данные не получены." subTitle="Простите, что-то пошло не так." />
            )}
        
        </>
    )
}
export default Home;