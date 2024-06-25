import React, { useEffect } from "react";
import { CoffeeOutlined,HomeOutlined,SettingOutlined,BellOutlined,UserAddOutlined,UserOutlined,QrcodeOutlined,ContactsOutlined, LogoutOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector} from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../app/store/store";
import { logout } from "../api/authSlice";
import { setActiveBottom, setActiveTop } from "../api/buttonSlice";
import { useUserLogoutMutation } from "../api/apiSlice";

import './navigation.css'
import '../../app/styles/vars.css'

const Navigation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const [userLogout] = useUserLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/home');
        dispatch(setActiveBottom(2));
    }, []);
    
    
    // отрисовка верхней навигации в зависимости от состояния
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const userLogin = useSelector((state: RootState) => state.auth.login)
    const role = useSelector((state: RootState) => state.auth.role);
    const top = useSelector((state: RootState) => state.button.top);
    const bottom = useSelector((state: RootState) => state.button.bottom);
    
    const handleUserLogoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await userLogout({});
            dispatch(logout());
            navigate('/login');
            dispatch(setActiveTop(1));
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
        ...(role === true ? [<Link to={`/admin-settings`}><SettingOutlined /></Link>] : [<Link to={`/user-settings`}><SettingOutlined /></Link>]),
        <Link to={`/contacts`}> <ContactsOutlined /> </Link>,
        <Link to={`/home`}><HomeOutlined /></Link>,
        <Link to={`/news`}><BellOutlined /></Link>,
        ...(role === true ? [<Link to={`/admin-coffee`}><CoffeeOutlined /></Link>] : [<Link to={`/user-coffee/${userLogin}`}><CoffeeOutlined /></Link>]),
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