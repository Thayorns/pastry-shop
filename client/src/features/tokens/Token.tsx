import React from "react";
// import { useGetTokenQuery } from "../api/apiSlice";
import { useParams } from 'react-router-dom';
import { Spin, Result } from "antd";


import './token.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'

const Token: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    // const { data, isLoading, isSuccess, isError } = useGetTokenQuery(token);

    // type TokenResponse = {
    //     message: string;
    // };
    // const tokenResponse = data as TokenResponse;

    return (
        <div className="token-div">
            <Result
                status="success"
                title="Ваш аккаунт успешно активирован!"
                subTitle="Теперь вы можете войти под своим логином и паролем."
            />
        </div>
    );
}
export default Token;