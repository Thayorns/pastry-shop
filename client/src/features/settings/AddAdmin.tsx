import React from "react";
import { Spin, Result, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { Link } from "react-router-dom";

import './settings.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const AddAdmin: React.FC = () => {

    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);


    return (
        <>
            <div className="add-settings-div">
                <Button type="dashed" className="backward-button">
                    <Link to={'/admin-settings'}><LeftOutlined /></Link>
                </Button>
            </div>
        
            {isAuth === false && (
                <Result status="403" title="403" subTitle="Простите, Вы не авторизованы и не можете зайти на эту страницу." />
            )}
        </>
        
    )
}
export default AddAdmin;