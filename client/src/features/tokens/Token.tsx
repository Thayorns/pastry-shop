import React from "react";
import { useGetTokenQuery } from "../api/apiSlice";
import { useParams } from 'react-router-dom';
import { Spin, Result } from "antd";


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
                <Result
                    status="success"
                    title="Ваш аккаунт успешно активирован!"
                    subTitle="Войдите под своим логином и паролем."
                />
            </div>
        );
    }else if(isError){
        content = 
        <div>
            <Result status="500" title="Ошибка" subTitle="Простите, что-то пошло не так." />
        </div>
    }
    return (
        <div className="token-div">
            {content}
        </div>
    );
}
export default Token;