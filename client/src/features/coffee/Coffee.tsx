import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { Button, Input, Spin } from 'antd';
import { useAddCoffeeMutation } from '../api/apiSlice';

import './coffee.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'

const Coffee: React.FC = () => {
    const [addCoffee, {isLoading, error }] = useAddCoffeeMutation()
    const [number, setNumber] = useState('');
    const [selectCoffee, setSelectCoffee] = useState('');
    const role = useSelector((state: RootState) => state.auth.role);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await addCoffee({ number: number, selectedCoffee: selectCoffee});
            setNumber('');
            setSelectCoffee('');
        }catch (err){
            console.error('Ошибка входа: ', err);
        }
    };

    // отрисовка контента
    let content: React.ReactNode;
    
    if(isLoading){
        content = <Spin/>
    }
    if(error){
        content = (
            <div className='error-div'>
                <p>ОШИБКА!</p>
            </div>
        )
    }
    if(role === true) {
        content = (
            <div className="admin-coffee">
                <p>Введите в поле qr-код посетителя, введите количество чашек кофе для добавления и нажмите "Добавить".</p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input 
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setNumber(e.target.value)} 
                            value={number} 
                            type="number" 
                            name="number" 
                            placeholder="Введите номер" 
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
                            placeholder="Введите количество кофе" 
                            required 
                        />
                    </div>
                    <Button htmlType="submit" type="primary" className="form-button" disabled={isLoading}>Добавить</Button>
                </form>
            </div>
        )
    }else if(role === false){
        content = (
            <div className="user-coffee">

            </div>
        )
    }else content = (
        <div>
         
        </div>
    )

    return content
}
export default Coffee;