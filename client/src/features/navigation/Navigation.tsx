import React, { useState } from "react";
import { CoffeeOutlined,HomeOutlined,SettingOutlined,BellOutlined,UserAddOutlined,UserSwitchOutlined,QrcodeOutlined,ContactsOutlined } from '@ant-design/icons';
import { useSelector} from "react-redux";
import { Link } from "react-router-dom"
import { RootState } from "../../app/store/store";

import './navigation.css'
import '../../app/styles/vars.css'

const Navigation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const [activeTopButton, setActiveTopButton] = useState<number | null>(null);
    const [activeBottomButton, setActiveBottomButton] = useState<number | null>(null);
    
    // функция переключения активных кнопок навигации
    const toggleActiveButton = (index: number, setAction: (num: number)=> void) => {
        setAction(index)
    };
    
    // отрисовка верхней навигации в зависимости от состояния
    const isAuthenticatedFromStore = useSelector((state: RootState) => state.auth.isAuthenticated);
    const role = useSelector((state: RootState) => state.auth.role);
    const topNavIcons = [
        ...(role === true ? [] : [<Link to={`/qr`}><QrcodeOutlined /></Link>]),
        <Link to={`/login`}><UserSwitchOutlined /></Link>,
        ...(isAuthenticatedFromStore === false ? [<Link to={`/register`}><UserAddOutlined /></Link>] : []),
    ];

    // отрисовка нижней навигации в зависимости от состояния
    const bottomNavIcons = [
        <Link to={`/settings`}><SettingOutlined /> </Link>,
        <Link to={`/contacts`}> <ContactsOutlined /> </Link>,
        <Link to={`/home`}><HomeOutlined /></Link>,
        <Link to={`/news`}><BellOutlined /></Link>,
        <Link to={`/coffee`}><CoffeeOutlined /></Link>,
    ];

    return (
        <div>
            <nav className="navbar-top">
                <span className="logo">Крем и Корж</span>
                <span className="top-nav-wrapper">
                    {topNavIcons.map((icon, index) => (
                        <button onClick={()=> {
                            toggleActiveButton(index,setActiveTopButton)
                            setActiveBottomButton(null)
                        }} key={index} 
                            className={activeTopButton === index ? 'navigation-button active' : 'navigation-button'} >
                            {icon}
                        </button>
                    ))}
                </span>
            </nav>

            <main>{children}</main>
            
            <nav className="navbar-bottom">
                <span className="bottom-nav-wrapper">
                    {bottomNavIcons.map((icon, index) => (
                        <button onClick={()=>{
                            toggleActiveButton(index,setActiveBottomButton)
                            setActiveTopButton(null)
                        }} key={index}  
                            className={activeBottomButton === index ? 'navigation-button active' : 'navigation-button'}> 
                            {icon}
                        </button>
                    ))}
                </span>    
            </nav> 
        </div>
    )
}
export default Navigation;