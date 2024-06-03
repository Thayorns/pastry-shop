import React from "react";
import { useGetTokenQuery } from "../api/apiSlice";
import { useParams } from 'react-router-dom';
import { Spin } from "antd";


import './token.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'

const Token: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const { isLoading, isSuccess, isError } = useGetTokenQuery(token);

    let content: React.ReactNode;

    if(isLoading){
        content = <Spin/>
    }else if(isSuccess){
        content = (
            <div className="token-div">
            <h2>Ваш аккаунт успешно активирован!<br/>  Добро пожаловать!</h2>
            </div>
        );
    }else if(isError){
        content = 
        <div>
            <h2>Ошибка...</h2>
        </div>
    }
    return (
        <div className="token-div">
            <h2>{content}</h2>
        </div>
    );
}
export default Token;