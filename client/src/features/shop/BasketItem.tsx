import React, { useState, useEffect } from "react";
import { Result, Button, Input, message, DatePicker, TimePicker } from 'antd';
import type { DatePickerProps, TimePickerProps } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../app/store/store";
import { LeftOutlined } from '@ant-design/icons';
import { Link, useParams, useNavigate } from "react-router-dom";
import { useBuyProductMutation } from "../api/apiSlice";
import { deleteCake } from "../api/productSlice";
import { setActiveBottom, clearBasketButton } from "../api/buttonSlice";

import './shop.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';


const BasketItem: React.FC = () => {
    
    const { cakeTitle } = useParams<{cakeTitle: string}>();
    const [buyProduct, {isError, isLoading, isSuccess}] = useBuyProductMutation();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState<string | string[]>('');
    const [time, setTime] = useState<string | string[]>('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const login = useSelector((state: RootState) => state.auth.login);
    const productArray = useSelector((state: RootState) => state.product.productArray);
    const product = productArray.find(el => el.title === cakeTitle);
    const counts = useSelector((state: RootState) => state.product.counts);    
    
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(dateString);
    };
    const onTimeChange: TimePickerProps['onChange'] = (time, timeString) => {
        setTime(timeString);
    };

    
    const [messageApi, contextHolder] = message.useMessage();
    
    const success = () => {
        messageApi.open({
            type: 'success',
            content: `We will contact you to confirm your order.`,
            duration: 3,
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Failed to place your order, an error occurred..',
            duration: 3,
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
            await buyProduct({ title: cakeTitle, date: date, name: name, phone: phone, login: login, photo: product?.photo, count: counts[product?.title || 1], time: time });
            
            setTimeout(() => {
                dispatch(deleteCake( { title: cakeTitle } ));
                dispatch(clearBasketButton( { title: cakeTitle }));
            }, 1000);
            
            setTimeout(() => {
                navigate('/shop');
                dispatch(setActiveBottom(0));
            }, 3000);

            setDate('');
            setName('');
            setPhone('');
        } catch (err) {
            console.error('Order error:', err);
        }
    };

    return (
        <>  
            {isAuth === true && (
                <div className="bascket-item-wrapper">

                    <Button type="dashed" className="backward-button">
                        <Link to={'/shop'}><LeftOutlined /></Link>
                    </Button>

                    {contextHolder}

                    <div className="basket-item">
                        <h3>Placing an order</h3>
                        <p><strong>{cakeTitle}</strong></p>

                        <form onSubmit={handleSubmit}>
                            <div className="date-picker">
                                <TimePicker placeholder='Time' format='HH:mm' onChange={onTimeChange}/>
                                <DatePicker placeholder='Date' onChange={onChange}/>
                                <span className="date-description"> - Select date and time.</span>
                            </div>
                            <div>
                                <Input 
                                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setName(e.target.value) } 
                                    value={name} 
                                    type="text" 
                                    name="name" placeholder="Your name" required
                                ></Input>
                            </div>
                            <div>
                                <Input 
                                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value) } 
                                    value={phone} 
                                    type="tel"
                                    name="phone" placeholder="Your phone" required
                                ></Input>
                            </div>
                            <Button htmlType="submit" type="primary" className="form-button" 
                                disabled={isLoading}
                            >Order</Button>
                        </form>
                    </div>
                </div>
            )}
        
            {isAuth === false && (
                <Result status="403" subTitle="Login to order a cake." />
            )}
        </>
        
    )
}
export default BasketItem;