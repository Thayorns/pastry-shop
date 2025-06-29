import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useGetProductsQuery, useDeleteProductMutation } from "../api/apiSlice";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { Spin, Result, message } from 'antd';
import { RightOutlined, DeleteOutlined, ShoppingCartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch} from "react-redux";
import { RootState } from "../../app/store/store";
import { buyCake } from "../api/productSlice";
import { setBasketButtonIsClicked } from "../api/buttonSlice";

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
    const {data, isError, refetch, isSuccess, isLoading} = useGetProductsQuery({})
    const [deleteProduct, {isError: deleteError, isSuccess: deleteSuccess}] = useDeleteProductMutation();
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const horizonRefs = useRef<(HTMLElement | null)[]>([]);
    const horizontalFilterRef = useRef<HTMLDivElement | null>(null);
    const role = useSelector((state: RootState) => state.auth.role);
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const basketIsClicked = useSelector((state: RootState) => state.button.basketIsClicked);
    const result = data as ResultResponse[] || [];
    
    const horizonAnchors = [ 
        'Cakes', 
        'Baked Goods', 
        'Desserts', 
        'Drinks', 
        'Sandwiches', 
        'Salads'
    ];
    const isScrolling = useRef(false);
    const isClicking = useRef(false);
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const successDelete = () => {
        messageApi.open({
            type: 'success',
            content: `You have successfully removed the product!`,
            duration: 5,
        });
    };
    const errorDelete = () => {
        messageApi.open({
            type: 'error',
            content: 'Failed to delete..',
            duration: 5,
        });
    };
    const successBuy = () => {
        messageApi.open({
            type: 'success',
            content: `You have added the cake to your cart!`,
            duration: 5,
        });
    };  
    
    const toggleActiveButton = (index: number) => {
        isClicking.current = true;
        setActiveHorizonFilter(index);
        setTimeout(() => {
            isClicking.current = false;
        }, 1000);
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
    const handleBuyProduct = async (title: string, price: number, photo: string) => {
        try {
            await dispatch(buyCake({ title,price,photo }));
            dispatch(setBasketButtonIsClicked({ title }));
            successBuy();
        } catch (error){
            console.error('Failed to add product:', error);
        }
    };

    const mapFunction = (arr: ResultResponse[]) => {
        const result = arr.map((obj, index) => {
            let imageSrc;
            if(process.env.NODE_ENV === 'development') imageSrc = require(`${process.env.REACT_APP_PHOTOS_BASE_URL}/${obj.photo}`);
            if(process.env.NODE_ENV === 'production') imageSrc = obj.photo ? `${process.env.REACT_APP_PHOTOS_BASE_URL}/${obj.photo}` : '';

            return (
                <div className="single-card-inner" key={index}>
                <Link to={`/home/${obj.title}`}>
                    {imageSrc ? <img src={imageSrc} alt={obj.title}></img> : null}
                </Link>
                <div className="card-description">
                    <div className="description-div">
                        <p>{obj.title}</p>
                        <span>{obj.price} руб.</span>
                    </div>
                    {role === true 
                    ? <DeleteOutlined disabled={isLoading} onClick={() => handleDeleteProduct(obj.title)} className="delete-button"/> 
                    : (obj.chapter === 'Cakes' && isAuth === true)
                        ?   basketIsClicked.includes(obj.title) 
                            ? <CheckCircleOutlined className="shopping-button"/> 
                            : <ShoppingCartOutlined className="shopping-button" onClick={() => handleBuyProduct(obj.title, obj.price, obj.photo)}/>
                        :   null
                    }
                </div>   
            </div>    
            )
        });
        return result;
    };

    useEffect(() => {
        refetch();
        if(deleteSuccess) successDelete();
        if(deleteError) errorDelete();
    }, [refetch, deleteSuccess, deleteError]);
     
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
              if (entry.isIntersecting && !isClicking.current) {
                const index = sectionRefs.current.indexOf(entry.target as HTMLElement);
                setActiveHorizonFilter(index);
                if (isScrolling.current) {
                    scrollToCenter(index);
                }
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

    useEffect(() => {
        const handleScroll = () => {
          if (!isScrolling.current) {
            isScrolling.current = true;
            setTimeout(() => {
              isScrolling.current = false;
            }, 1000);
          }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    return (
        <>
            {isLoading && (<Spin/>)}
            
            {isSuccess && (
                <div className="home-div">
                    {contextHolder}
                    <div className="horizontal-filter" ref={horizontalFilterRef}>
                        {horizonAnchors.map((anchor, index) => 
                            <AnchorLink key={index} offset={() => 100} href={`#${anchor}`}>
                                <span onClick={() => toggleActiveButton(index)}
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
                <Result status="500" title="No data received." subTitle="Sorry, something went wrong." />
            )}
        
        </>
    )
}
export default Home;