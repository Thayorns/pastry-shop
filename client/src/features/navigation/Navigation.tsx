import React, { useEffect, useState } from "react";
import { CoffeeOutlined,HomeOutlined,SettingOutlined,BellOutlined,UserAddOutlined,UserOutlined,QrcodeOutlined,ContactsOutlined, LogoutOutlined, UserSwitchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useDispatch, useSelector} from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../app/store/store";
import { logout } from "../api/authSlice";
import { setActiveBottom, setActiveTop } from "../api/buttonSlice";
import { useUserLogoutMutation } from "../api/apiSlice";
import { Badge } from 'antd';
import { dropCakes } from "../api/productSlice";

import './navigation.css'
import '../../app/styles/vars.css'

const Navigation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const [userLogout] = useUserLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const userLogin = useSelector((state: RootState) => state.auth.login)
    const role = useSelector((state: RootState) => state.auth.role);
    const top = useSelector((state: RootState) => state.button.top);
    const bottom = useSelector((state: RootState) => state.button.bottom);
    const productArray = useSelector((state: RootState) => state.product.productArray);

    // useEffect(() => {
    //     const ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/ws`);
    //     ws.onopen = () => {
    //       console.log('WebSocket connection opened');
    //     };
    //     ws.onmessage = (event) => {
    //     //   console.log('WebSocket message received:', event);
    //       const message = JSON.parse(event.data);
    //       if (message.type === 'newOrder') {
    //         setOrderCount((prevCount) => prevCount + 1);
    //       }
    //     };
    //     ws.onerror = (error) => {
    //       console.error('WebSocket error:', error);
    //     };
    //     ws.onclose = (event) => {
    //       console.log(`WebSocket connection closed: code=${event.code}, reason=${event.reason}`);
    //     };
    //     return () => {
    //       ws.close();
    //     };
    // }, []);

    useEffect(() => {
        navigate('/home');
        dispatch(setActiveBottom(2));
    }, []);
    
    const handleUserLogoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await userLogout({});
            dispatch(logout());
            navigate('/login');
            dispatch(setActiveTop(1));
            dispatch(dropCakes());
        }catch (err){
            console.error('Ошибка выхода: ', err);
        }
    }
    
    const topNavIcons = [
        ...(role === true ? [] : [<Link to={`/qr`}><QrcodeOutlined /></Link>]),
        ...(isAuth === true ? [<Link to={`/login`}><UserOutlined /></Link>] : [<Link to={`/login`}><UserSwitchOutlined /></Link>]) ,
        ...(isAuth === false ? [<Link to={`/register`}><UserAddOutlined /></Link>] : [<LogoutOutlined onClick={handleUserLogoutSubmit} />]),
    ];
    const bottomNavIcons = [
        ...(role === true 
            ? [<Link to={`/admin-settings`}><SettingOutlined /></Link>] 
            : [<Link to={`/shop`}>
                <Badge count={productArray.length}>
                    <ShoppingCartOutlined />
                </Badge>
            </Link>]),
        <Link to={`/contacts`}> <ContactsOutlined /> </Link>,
        <Link to={`/home`}><HomeOutlined /></Link>,
        <Link to={`/news/${userLogin}`}><BellOutlined />
            {/* {role === true 
                ? <Badge count={orderCount}><BellOutlined /></Badge>
                : <Badge count={orderedArray.length}><BellOutlined /></Badge>
            } */}
        </Link>,
        ...(role === true 
            ? [<Link to={`/admin-coffee`}><CoffeeOutlined /></Link>] 
            : [<Link to={`/user-coffee/${userLogin}`}><CoffeeOutlined /></Link>]
        ),
    ];

    return (
        <div>
            <nav className="navbar-top">
                <span className="logo">КРЕМ и КОРЖ</span>
                <span className="top-nav-wrapper">
                    {topNavIcons.map((icon, index) => (
                        <button onClick={()=> { dispatch(setActiveTop(index)) }} key={index} 
                            className={top === index ? 'navigation-button active' : 'navigation-button'} >
                            {icon}
                        </button>
                    ))}
                </span>
            </nav>

            <main>{children}</main>
            
            <nav className="navbar-bottom">
                <span className="bottom-nav-wrapper">
                    {bottomNavIcons.map((icon, index) => (
                        <button onClick={()=>{ dispatch(setActiveBottom(index)) }} key={index}  
                            className={bottom === index ? 'navigation-button active' : 'navigation-button'}> 
                            {icon}
                        </button>
                    ))}
                </span>    
            </nav> 
        </div>
    )
}
export default Navigation;