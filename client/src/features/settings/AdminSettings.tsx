import React from "react";
import { Spin, Result } from 'antd';
import { AppstoreAddOutlined, ShareAltOutlined, ProductOutlined, CameraOutlined, UsergroupAddOutlined, RightOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { Link } from "react-router-dom";

import './settings.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const AdminSettings: React.FC = () => {

    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

    const array = [
        { icon: <ProductOutlined/>, description: 'Add new products with descriptions.', link: '/admin-settings/add-product'},
        { icon: <ShareAltOutlined/>, description: 'Add new admin.', link: '/admin-settings/add-admin'},
        { icon: <UsergroupAddOutlined/>, description: 'Add client to friend.', link: '/admin-settings/add-friend'},
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
                            <RightOutlined className="right-arrow"/>
                        </Link>    
                    ))}
                </div>
            )}
        
            {isAuth === false && (
                <Result status="403" subTitle="Sorry, you are not logged in and cannot access this page." />
            )}
        </>
        
    )
}
export default AdminSettings;