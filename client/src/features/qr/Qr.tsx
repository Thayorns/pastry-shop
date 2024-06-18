import React, { useEffect } from "react";
import { useAddQRcodeMutation } from "../api/apiSlice";
import { RootState } from "../../app/store/store";
import { useSelector } from 'react-redux';
import { Spin, Result } from 'antd';

import './qr.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const Qr: React.FC = () => {

    const [addQRcode, { isLoading, isError }] = useAddQRcodeMutation();
    
    // использую глобал-стейт авторизованного
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const loading = useSelector((state: RootState) => state.qr.loadingStatus);
    const role = useSelector((state: RootState) => state.auth.role);
    const userLogin = useSelector((state: RootState) => state.auth.login);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const numberFromStore = useSelector((state: RootState) => state.qr.number);
    const qrUrlFromStore = useSelector((state: RootState) => state.qr.qrCode);
    
    useEffect(() => {
        if(accessToken) {
            addQRcode({ login: userLogin })
        }
    }, [addQRcode, userLogin]);
    
    return (
        <>
            {(loading === 'loading') && <Spin />}

            {isError && (
                <Result status="500" title="Ошибка" subTitle="Простите, что-то пошло не так." />
            )}

            {(isAuth === false) && (
                <Result status="403" title="403" subTitle="Простите, Вы не авторизованы и не можете зайти на эту страницу." />
            )}
        
            {(isAuth === true && role === false) && (
                <div className="qr-div">
                    <h1>ВАШ КОД</h1>
                    <p>Покажите или назовите код кассиру в "КРЕМ и КОРЖ", чтобы накопить подарочный кофе.</p>
                    <img src={qrUrlFromStore} alt="qr-code"/>
                    <h2>{numberFromStore}</h2>
                </div>
            )}
        </>
    )
};
export default Qr;