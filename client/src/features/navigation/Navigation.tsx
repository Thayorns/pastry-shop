import React, { useState } from "react";
import { CoffeeOutlined,HomeOutlined,SettingOutlined,BellOutlined,UserSwitchOutlined,QrcodeOutlined,UserOutlined,ContactsOutlined } from '@ant-design/icons';
import { Segmented, Spin } from 'antd';
import { SegmentedProps } from 'antd/es/segmented';
import './navigation.css'
import '../../app/styles/vars.css'

const Navigation: React.FC = () => {
    const [activeSegment, setActiveSegment] = useState<string | number>('login');
    
    const options:SegmentedProps['options'] = [
        { value: 'settings', icon: <SettingOutlined /> },
        { value: 'contacts', icon: <ContactsOutlined /> },
        { value: 'home', icon: <HomeOutlined /> },
        // { value: 'vzvzv', icon: <SettingOutlined /> },
        { value: 'news', icon: <BellOutlined /> },
        { value: 'coffee', icon: <CoffeeOutlined /> },
        
    ];
    return (
        <div>
            <nav className="navbar-top">
                <span className="logo">Крем и Корж</span>
                <span className="top-nav-wrapper">
                    <Segmented 
                        value={activeSegment}
                        onChange={setActiveSegment}
                        block
                        options={[
                            { value: 'qr', icon: <QrcodeOutlined /> },
                            { value: 'register', icon: <UserSwitchOutlined /> },
                            { value: 'login', icon: <UserOutlined/> },
                            // { value: 'login', icon: <img src={require('../../app/store/images/user-logged.png')} alt=""/> },
                        ]}
                    />
                </span>
            </nav>

            <h1>Крем и Корж</h1>
            <Spin />
            <nav className="navbar-bottom">
                <Segmented
                    value={activeSegment}
                    onChange={setActiveSegment}
                    block
                    options={options}
                />
            </nav> 
        </div>
    )
}
export default Navigation;