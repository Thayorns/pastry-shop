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

    const chapterMap = horizonAnchors.reduce((accumulator, chapter) => {
        accumulator[chapter] = result.filter(obj => obj.chapter === chapter);
        return accumulator;
    }, {} as Record<string, ResultResponse[]>);

    const mapFunction = (arr: ResultResponse[]) => {
        const result = arr.map((obj, index) => (
            <div className="single-card-inner" key={index}>
                <img src={require(`../../../../product-photos/${obj.photo}`)} alt=""/>
                <p>{obj.title}</p>
                <span>{obj.price} руб.</span>
            </div>    
        ));
        return result;
    };

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
                        {horizonAnchors.map((chapter, index) => (
                            <div id={chapter} className="cards-wrapper" key={index}>
                                <h3>{chapter.toUpperCase()}<RightOutlined className="title-arrow"/></h3>
                                {mapFunction(chapterMap[chapter])}
                            </div>
                        ))}
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