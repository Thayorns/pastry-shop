import React from "react";
import { Spin, Result } from 'antd';
import { AppstoreAddOutlined, ShareAltOutlined, ProductOutlined, CameraOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { Link } from "react-router-dom";

import './settings.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const AdminSettings: React.FC = () => {

    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

    const array = [
        { icon: <AppstoreAddOutlined/>, description: 'Добавить новые позиции блюд с описанием.', link: '/admin-settings/add-product'},
        { icon: <ShareAltOutlined/>, description: 'Добавить нового администратора.', link: '/admin-settings/add-admin'},
        { icon: <UsergroupAddOutlined/>, description: 'Добавить посетителя в друзья.', link: '/admin-settings/add-friend'},
    ]

    return (
        <>
            {isAuth === true && (
                <div className="settings-div">
                    {array.map((el, index) => (
                        <Link key={index} to={el.link}>
                            <div  className="settings-card">
                                {el.icon}
                                <span>{el.description}</span>
                            </div>
                        </Link>    
                    ))}
                </div>
            )}
        
            {isAuth === false && (
                <Result status="403" title="403" subTitle="Простите, Вы не авторизованы и не можете зайти на эту страницу." />
            )}
        </>
        
    )
}
export default AdminSettings;