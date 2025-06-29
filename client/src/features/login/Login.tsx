import React, { useEffect, useState } from "react";
import { Button, Input, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setActiveTop } from "../api/buttonSlice";
import { useLogInUserMutation } from "../api/apiSlice";
import { RootState } from "../../app/store/store";

import './login.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'


const Login: React.FC = () => {
    const [logInUser,{error}] = useLogInUserMutation();
    const dispatch = useDispatch();

    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const role = useSelector((state: RootState) => state.auth.role);
    const friend = useSelector((state: RootState) => state.auth.friend);
    const userLoginFromStore = useSelector((state:RootState) => state.auth.login)
    const loginStatus = useSelector((state: RootState) => state.auth.loginStatus);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await logInUser({ login: userName, password: userPassword});
        }catch (err){
            console.error('Entry error: ', err);
        }
    };
    
    useEffect(() => {
        if (isAuth) {
            dispatch(setActiveTop(role ? 0 : 1));
        }
    }, [isAuth, role, dispatch]);
    
    const errorDisplay: React.ReactNode = error as React.ReactNode;

    return (
        <>
            {(loginStatus === 'loading') && (<Spin/>)}

            {(isAuth === true && role === true) && (
                <div className="admin-logged">
                    <h1>Admin - <strong>{userLoginFromStore}</strong></h1>
                    <p>For administrators, the application has some advanced functionality that is not available to clients.</p>
                    <p>In the "Settings" section you can add clients as friends, to do this, simply enter their login.</p>    
                    <p>In the "settings" section you can grant the user administrator rights. Be selective in your decision.</p>   
                    <p>In the "Settings" section you can add new product items with a photo, price, composition and description.</p>   
                    <p>In the "Home" section, you can remove products from the feed by clicking on "Cart".</p>   
                    <p>In the "coffee" section you can add a gift coffee for customers, just enter the number that he will announce.</p>
                    <p>In the "notifications" section, you can confirm or delete cake orders from customers.</p>
                </div>
            )}

            {(isAuth === true && role === false) && (
                <div className="user-logged">

                    {friend === true ? (
                        <div className="user-friend-logged-wrapper">
                            <div className="user-friend-logged-inner">
                                <p>friend card</p>
                                <h1>{userLoginFromStore}</h1>
                                <p>bakery and confectionery products</p>
                                <h1>MY PASTRY SHOP</h1>
                                <p>15% discount on all products</p>
                            </div>
                        </div>
                    ) : (
                        <div className="user-logged-wrapper">
                            <h1>{userLoginFromStore}!</h1>
                            <p>You can take advantage of the promotions held at "MY PASTRY SHOP", for example, free coffee.</p>
                            <p>For further instructions, click on the "QR code" section.</p>
                        </div>
                        )
                    }
                    
                </div>
            )}

            {(isAuth === false) && (
                <div className="login-form">
                    <h1>LOGIN TO YOUR ACCOUNT</h1>
                    
                    <span>Please fill out the form to log into your account.</span>
                    
                    <span className="link-to-register">Not registered yet? - <Link to={`/register`}><strong>REGISTRATION</strong></Link></span>
                    
                    {errorDisplay && (
                        <div className="error-register">
                            <p>Error: You either entered an incorrect login or password, or you have not activated your account via email.</p>
                            <p>Try again.</p>
                        </div>
                    ) as React.ReactNode}
                    
                    <form onSubmit={handleSubmit}>
                        <div>
                            <Input 
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} 
                                value={userName} 
                                type="text" 
                                name="username" 
                                placeholder="Your login" 
                                required 
                            />
                        </div>
                        <div>
                            <Input 
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value)} 
                                value={userPassword} 
                                type="password" 
                                name="password" 
                                placeholder="Your password" 
                                required 
                            />
                        </div>
                        <Button htmlType="submit" type="primary" className="form-button" disabled={loginStatus === 'loading'}>Enter</Button>
                    </form>
                </div>
            )}
        </>
    )
}
export default Login;