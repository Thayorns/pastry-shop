import React, { useEffect, useState, useRef } from "react";
// import { useIntersectionObserver } from 'usehooks-ts';
import { useGetProductsQuery, useDeleteProductMutation } from "../api/apiSlice";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { Spin, Result } from 'antd';
import { RightOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector} from "react-redux";
import { RootState } from "../../app/store/store";

import './home.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';
interface ResultResponse {
    chapter: string;
    description: string;
    ingredients: string;
    photo: string;
    price: number;
    title: string;
}
const Home: React.FC = () => {

    const [activeHorizonFilter, setActiveHorizonFilter] = useState<number | null>(0);
    const [deleteProduct] = useDeleteProductMutation();
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const horizonRefs = useRef<(HTMLElement | null)[]>([]);
    const horizontalFilterRef = useRef<HTMLDivElement | null>(null);
    
    const toggleActiveButton = (index: number, setAction: (num: number)=> void) => {
        setAction(index);
        scrollToCenter(index);
    };
    const scrollToCenter = (index: number) => {
        const element = horizonRefs.current[index];
        const container = horizontalFilterRef.current;
        if (element && container) {
            const elementOffset = element.offsetLeft;
            const elementWidth = element.clientWidth;
            const containerWidth = container.clientWidth;
            const scrollPosition = elementOffset - (containerWidth / 2) + (elementWidth / 2);
            
            container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
        }
    };

    const {data, isError, refetch, isSuccess, isLoading} = useGetProductsQuery({})
    const role = useSelector((state: RootState) => state.auth.role);
    
    const result = data as ResultResponse[] || [];

    const horizonAnchors = [ 'Торты', 'Выпечка', 'Десерты', 'Напитки', 'Сендвичи', 'Салаты' ];
    

    const chapterMap = horizonAnchors.reduce((accumulator, chapter) => {
        accumulator[chapter] = result.filter(obj => obj.chapter === chapter);
        return accumulator;
    }, {} as Record<string, ResultResponse[]>);

    const handleDeleteProduct = async (title: string) => {
        try {
            await deleteProduct(title);
            refetch();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const mapFunction = (arr: ResultResponse[]) => {
        const result = arr.map((obj, index) => (
            <div className="single-card-inner" key={index}>
                <img src={require(`../../../../product-photos/${obj.photo}`)} alt=""/>
                <div className="card-description">
                    <div className="description-div">
                        <p>{obj.title}</p>
                        <span>{obj.price} руб.</span>
                    </div>
                    {role === true 
                    ? <DeleteOutlined disabled={isLoading} onClick={() => handleDeleteProduct(obj.title)} className="delete-button"/> 
                    : null}
                </div>   
            </div>    
        ));
        return result;
    };

    useEffect(() => {
        refetch();
    }, [refetch]);
     
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };
    
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = sectionRefs.current.indexOf(entry.target as HTMLElement);
                setActiveHorizonFilter(index);
                scrollToCenter(index);
            }
          });
        };
    
        const observer = new IntersectionObserver(observerCallback, observerOptions);
    
        sectionRefs.current.forEach(section => {
            if (section) observer.observe(section);
        });
    
        return () => {
          if (observer) {
            sectionRefs.current.forEach(section => {
              if (section) observer.unobserve(section);
            });
          }
        };
    }, []);
    
    return (
        <>
            {isLoading && (<Spin/>)}
            
            {isSuccess && (
                <div className="home-div">
                    <div className="horizontal-filter" ref={horizontalFilterRef}>
                        {horizonAnchors.map((anchor, index) => 
                            <AnchorLink key={index} offset={() => 100} href={`#${anchor}`}>
                                <span onClick={() => toggleActiveButton(index, setActiveHorizonFilter)}
                                    ref={el => horizonRefs.current[index] = el}
                                    className={activeHorizonFilter === index ? "horizon-anchors active" : "horizon-anchors"}>
                                    {anchor}
                                </span>
                            </AnchorLink>
                        )}
                    </div>
                    <div className="vertical-filter">
                        {horizonAnchors.map((chapter, index) => (
                            <div id={chapter} className="cards-wrapper" key={index}
                                ref={el => sectionRefs.current[index] = el}>
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