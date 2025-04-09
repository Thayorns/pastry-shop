import React from "react";
import { Result } from "antd";


import './token.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'

const Token: React.FC = () => {

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