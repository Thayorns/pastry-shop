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

    // check if response exists
    const result = data as ResultResponse | undefined;

    let imageSrc;
    if(process.env.NODE_ENV === 'development') imageSrc = require(`${process.env.REACT_APP_PHOTOS_BASE_URL}/${result?.photo}`);
    if(process.env.NODE_ENV === 'production') imageSrc = result?.photo ? `${process.env.REACT_APP_PHOTOS_BASE_URL}/${result.photo}` : '';

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
                        <p><strong>Состав: </strong></p>
                        <p>{result.ingredients}</p>
                    </div>

                </div>
            )}

            {isError && (
                <Result status="500" title="Данные не получены." subTitle="Простите, что-то пошло не так." />
            )}
        </>
    )
};
export default Product;