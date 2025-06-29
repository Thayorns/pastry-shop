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
                title="Your account has been successfully activated!"
                subTitle="You can now log in using your username and password."
            />
        </div>
    );
}
export default Token;