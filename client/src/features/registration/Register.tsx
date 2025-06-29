import React, { useState } from "react";
import { Button, Input, Spin, Result } from 'antd';
import { useAddUserMutation } from "../api/apiSlice";
import { LeftOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

import './register.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const Register: React.FC = () => {
    const [addUser, { isLoading, error, isSuccess }] = useAddUserMutation()
    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')
    
    // user register func
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await addUser({ email: userEmail, login: userName, password: userPassword})
        }catch(err){
            console.error('Error registration: ', err);
        }
    }
    
    const errorDisplay: React.ReactNode = error as React.ReactNode;
    let content: React.ReactNode;
    
    if(isLoading){
        content = <Spin/>
    }else if(isSuccess){
        content = (
            <div className="success-register">
                <h2><strong>{userName}</strong></h2>
                <Result
                    status="success"
                    title="You have registered successfully!"
                    subTitle="Activate your account within 1 hour to take advantage of our promotions like free coffee with QR code."
                />
                <p>An account activation email has been sent to your email address. <span className="email-underlined">{userEmail}</span></p>
            </div>
        )
    }else{
        content = (
            <div className="register">
                
                <Button type="dashed" className="backward-button">
                    <Link to={'/login'}><LeftOutlined /></Link>
                </Button>
                
                <h1>REGISTRATION</h1>
                <span>Fill out the form to create a new account in "MY PASTRY SHOP".</span>
                {errorDisplay && (
                    <div className="error-register">
                        <p>Error registration</p>
                        <p>Try again.</p>
                    </div>
                ) as React.ReactNode}
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserEmail( e.target.value)} 
                            value={userEmail} 
                            type="email" 
                            name="email" placeholder="Enter your email" required
                        ></Input>
                    </div>
                    <div>
                        <Input 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value) } 
                            value={userName} 
                            type="text" 
                            name="username" placeholder="Enter your login" required
                        ></Input>
                    </div>
                    <div>
                        <Input 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value)} 
                            value={userPassword} minLength={8}
                            type="password" 
                            name="password" placeholder="Enter your password" required
                        ></Input>
                    </div>
                    <Button htmlType="submit" type="primary" className="form-button" disabled={isLoading}>Accept</Button>
                </form>
            </div>
        )
    }
    
    return content
};
export default Register;