import React, { useEffect, useState } from "react";
import { CoffeeOutlined,HomeOutlined,SettingOutlined,BellOutlined,UserAddOutlined,UserOutlined,QrcodeOutlined,ContactsOutlined, LogoutOutlined, UserSwitchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useDispatch, useSelector} from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../app/store/store";
import { logout } from "../api/authSlice";
import { setActiveBottom, setActiveTop } from "../api/buttonSlice";
import { webSocketConnected, webSocketDisconnected, webSocketMessageReceived } from "../api/webSocketSlice";
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
    const messages = useSelector((state: RootState) => state.webSocket.messages);

    useEffect(() => {
        const ws = new WebSocket('wss://www.creamkorzh.ru:3001');
        ws.onopen = () => {
            dispatch(webSocketConnected());
            ws.send(JSON.stringify({ type: 'login', userLogin }));
            // console.log(`user ${userLogin} connected to WS`);
        };
        ws.onmessage = (event) => {
            // console.log('Received raw message:', event.data); // Логирование полученного сообщения
            try {
                const data = JSON.parse(event.data);
                // console.log('WebSocket message received:', data);
        
                if(data.type === 'newOrder' && role === true) {
                    dispatch(webSocketMessageReceived({ order: data.order }));
                    // console.log('Dispatching new order:', data.order);
                }
                if(data.type === 'coffee') {
                    dispatch(webSocketMessageReceived({ order: data.coffeeCount }));
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        ws.onclose = (event) => {
            dispatch(webSocketDisconnected());
            // console.log('WebSocket closed:', event);
        };
        return () => {
            ws.close();
        };
    }, [dispatch, userLogin]);    

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
    };
    
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
        <Link to={`/news/${userLogin}`}>
            {role === true ? <Badge count={messages.length}><BellOutlined /></Badge> : <BellOutlined />}            
        </Link>,
        ...(role === true 
            ? [<Link to={`/admin-coffee`}><CoffeeOutlined /></Link>] 
            : [<Link to={`/user-coffee/${userLogin}`}>
                <Badge count={messages.length}>
                    <CoffeeOutlined />
                </Badge></Link>
            ]
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