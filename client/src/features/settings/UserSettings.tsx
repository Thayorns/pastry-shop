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
                <Result status="403" title="403" subTitle="Простите, Вы не авторизованы и не можете зайти на эту страницу." />
            )}
        </>
        
    )
}
export default UserSettings;