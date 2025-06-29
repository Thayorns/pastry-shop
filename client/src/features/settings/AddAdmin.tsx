import React, { useState, useEffect } from "react";
import { Spin, Result, Button, message, Input } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { Link } from "react-router-dom";
import { useAddAdminMutation } from "../api/apiSlice";

import './settings.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const AddAdmin: React.FC = () => {
    const [addAdmin, {isError, isSuccess, isLoading}] = useAddAdminMutation();
    const [userLogin, setUserLogin] = useState('');
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [messageApi, contextHolder] = message.useMessage();
    
    const success = () => {
        messageApi.open({
            type: 'success',
            content: `You have added a new administrator!`,
            duration: 5,
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'An error occurred! Not added..',
            duration: 5,
        });
    };
    useEffect(() => {
        if (isSuccess) {
            success();
        }
        if (isError) {
            error();
        }
    }, [isSuccess, isError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addAdmin({ login: userLogin });
            setUserLogin('');
        } catch (err) {
            console.error('An error occurred! Not added:', err);
        }
    };

    return (
        <>
            {isLoading && (<Spin/>)}

            {isAuth === true && (
                <div className="add-settings-div">
                    {contextHolder}
                    <Button type="dashed" className="backward-button">
                        <Link to={'/admin-settings'}><LeftOutlined /></Link>
                    </Button>
                    <p>Fill out the form to grant the user administrator rights.</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div>
                            <Input 
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserLogin(e.target.value) } 
                                value={userLogin} 
                                type="text" 
                                name="login" placeholder="Enter user login" required
                            ></Input>
                        </div>
                        <Button htmlType="submit" type="primary" className="form-button" disabled={isLoading}>Add</Button>
                            
                    </form>
                </div>
            )}
        
            {isAuth === false && (
                <Result status="403" subTitle="Log in." />
            )}
        </>
        
    )
}
export default AddAdmin;