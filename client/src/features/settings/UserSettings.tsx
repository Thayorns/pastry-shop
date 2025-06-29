import React from "react";
import { Spin, Result } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";

import './settings.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const UserSettings: React.FC = () => {

    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);


    return (
        <>

        
            {isAuth === false && (
                <Result status="403" subTitle="Sorry, you are not logged in and cannot access this page." />
            )}
        </>
        
    )
}
export default UserSettings;