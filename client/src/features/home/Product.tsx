import React from "react";
import { useParams } from 'react-router-dom';
import { useGetProductQuery } from "../api/apiSlice";
import { Spin, Result, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

import './home.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

interface ResultResponse {
    description: string;
    ingredients: string;
    photo: string;
    title: string;
}

const Product: React.FC = () => {
    const { productTitle } = useParams();
    const {data, isError, isLoading, isSuccess} = useGetProductQuery(productTitle);
    
    const result = data as ResultResponse | undefined;

    let imageSrc;

    if(isSuccess && result && process.env.NODE_ENV === 'development') {
        try{
            imageSrc = require(`${process.env.REACT_APP_PHOTOS_BASE_URL}/${result.photo}`);
        }catch(err){
            console.error('Error loading image', err);
            imageSrc = '';
        }
    }else{
        try{
            imageSrc = result?.photo ? `${process.env.REACT_APP_PHOTOS_BASE_URL}/${result.photo}` : '';
        }catch(err){
            console.error('Error loading image', err);
        }
    }

    return (
        <>
            {isLoading && (<Spin/>)}

            {isSuccess && result && (
                <div className="product-div">

                    <Button type="dashed" className="backward-button">
                        <Link to={'/home'}><LeftOutlined /></Link>
                    </Button>

                    <div className="product-inner">
                        {imageSrc ? <img className="product-photo" src={imageSrc} alt={result.title}></img> : null}
                        <h3><strong>{result.title}</strong></h3>
                        <p>{result.description}</p>
                        <p><strong>Ingredients: </strong></p>
                        <p>{result.ingredients}</p>
                    </div>

                </div>
            )}

            {isError && (
                <Result status="500" title="No data received." subTitle="Sorry. Something went wrong." />
            )}
        </>
    )
};
export default Product;