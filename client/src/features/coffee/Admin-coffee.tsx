import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { Button, Input, message, Result } from 'antd';
import { useAddCoffeeMutation } from '../api/apiSlice';

import './coffee.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const AdminCoffee: React.FC = () => {

    const [addCoffee, { data, isLoading, isError, isSuccess }] = useAddCoffeeMutation();

    const [number, setNumber] = useState('');
    const [selectCoffee, setSelectCoffee] = useState('');
    
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [messageApi, contextHolder] = message.useMessage();

    type UserLoginFromResponse = {
        userLogin: string;
    }
    const user = data as UserLoginFromResponse;
    
    const success = () => {
        messageApi.open({
            type: 'success',
            content: `Client '${user.userLogin}' gets a coffee!`,
            duration: 5,
        });
    };
    
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Client with such QR code not found!',
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
        try{
            await addCoffee({ number: number, selectedCoffee: selectCoffee});
            setNumber('');
            setSelectCoffee('');
        }catch (err){
            console.error('Entry error: ', err);
        }
    };

    return (
        <>
            {(isAuth === true) && (
                <div className="admin-coffee">
                    {contextHolder}
                    <p>Enter the visitor's QR code in the field, enter the number of cups of coffee to add and click "Add".</p>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <Input 
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setNumber(e.target.value)} 
                                value={number} 
                                type="number" 
                                name="number" 
                                placeholder="Enter number" 
                                required
                                max={9999}
                            />
                        </div>
                        <div>
                            <Input max={8}
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setSelectCoffee(e.target.value)}
                                value={selectCoffee}
                                type="number" 
                                name="selectCoffee" 
                                placeholder="Enter quantity of coffee" 
                                required 
                            />
                        </div>
                        <Button htmlType="submit" type="primary" className="form-button" disabled={isLoading}>Add</Button>
                    </form>
                </div>
            )}
            
            {isAuth === false && (
                <Result status="403" subTitle="Sorry, you are not logged in and cannot access this page." />
            )}
        </>
    )
}
export default AdminCoffee;