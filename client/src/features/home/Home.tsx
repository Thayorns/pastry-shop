import React, { useEffect, useState } from "react";
import { useGetProductsQuery } from "../api/apiSlice";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { Spin, Result } from 'antd';
import {RightOutlined } from '@ant-design/icons';

import './home.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'

const Home: React.FC = () => {

    const [activeHorizonFilter, setActiveHorizonFilter] = useState<number | null>(0);
    
    const toggleActiveButton = (index: number, setAction: (num: number)=> void) => {
        setAction(index)
    };

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

    const horizonAnchors = [ 'Торты', 'Выпечка', 'Десерты', 'Напитки', 'Сендвичи', 'Салаты' ];

    const chapterCake = result.filter(obj => obj.chapter === 'Торты');
    const chapterBakery = result.filter(obj => obj.chapter === 'Выпечка');
    const chapterDesserts = result.filter(obj => obj.chapter === 'Десерты');
    const chapterDrinks = result.filter(obj => obj.chapter === 'Напитки');
    const chapterSandwitches = result.filter(obj => obj.chapter === 'Сендвичи');
    const chapterSalads = result.filter(obj => obj.chapter === 'Салаты');

    const mapFunction = (arr: ResultResponse[]) => {
        const result = arr.map((obj, index) => (
            <div className="single-card-inner">
                <img key={index} src={require(`../../../../product-photos/${obj.photo}`)} alt=""/>
                <p>{obj.title}</p>
                <span>{obj.price} руб.</span>
            </div>    
        ));
        return result;
    };
    
    let filteredCakes = mapFunction(chapterCake),
    filteredBakery = mapFunction(chapterBakery),
    filteredDeserts = mapFunction(chapterDesserts),
    filteredDrinks = mapFunction(chapterDrinks),
    filteredSandwitches = mapFunction(chapterSandwitches),
    filteredSalads = mapFunction(chapterSalads);

    return (
        <>
            {isLoading && (<Spin/>)}
            
            {isSuccess && (
                <div className="home-div">

                    <div className="horizontal-filter">
                        {horizonAnchors.map((anchor, index) => 
                            <AnchorLink key={index} offset={() => 100} href={`#${anchor}`}>
                                <span onClick={() => toggleActiveButton(index, setActiveHorizonFilter)}
                                    className={activeHorizonFilter === index ? "horizon-anchors active" : "horizon-anchors"}>
                                    {anchor}
                                </span>
                            </AnchorLink>
                            
                        )}
                    </div>

                    <div className="vertical-filter">
                        
                        <div id="Торты" className="cards-wrapper">
                            <h3>ТОРТЫ <RightOutlined className="title-arrow"/></h3>
                            {filteredCakes}
                        </div>
                        <div  id="Выпечка" className="cards-wrapper">
                            <h3>ВЫПЕЧКА <RightOutlined className="title-arrow"/></h3>
                            {filteredBakery}
                        </div>
                        <div  id="Десерты" className="cards-wrapper">
                            <h3>ДЕСЕРТЫ <RightOutlined className="title-arrow"/></h3>
                            {filteredDeserts}
                        </div>
                        <div id="Напитки" className="cards-wrapper">
                            <h3>НАПИТКИ <RightOutlined className="title-arrow"/></h3>
                            {filteredDrinks}
                        </div>
                        <div id="Сендвичи" className="cards-wrapper">
                            <h3>СЕНДВИЧИ <RightOutlined className="title-arrow"/></h3>
                            {filteredSandwitches}
                        </div>
                        <div id="Салаты" className="cards-wrapper">
                            <h3>САЛАТЫ <RightOutlined className="title-arrow"/></h3>
                            {filteredSalads}
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