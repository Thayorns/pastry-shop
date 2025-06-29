import React, { useEffect } from "react";
import { useAddQRcodeMutation } from "../api/apiSlice";
import { RootState } from "../../app/store/store";
import { useSelector } from 'react-redux';
import { Spin, Result } from 'antd';

import './qr.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const Qr: React.FC = () => {

    const [addQRcode, { isError }] = useAddQRcodeMutation();
    
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
                <Result status="500" title="Error" subTitle="Sorry. Something went wrong." />
            )}

            {(isAuth === false) && (
                <Result status="403" subTitle="Log in to generate a QR code for gift coffee." />
            )}
        
            {(isAuth === true && role === false) && (
                <div className="qr-div">
                    <h1>YOUR CODE</h1>
                    <p>Show or say the code to the cashier at "MY PASTRY SHOP" to receive a free coffee.</p>
                    <img src={qrUrlFromStore} alt="qr-code"/>
                    <h2>{numberFromStore}</h2>
                </div>
            )}
        </>
    )
};
export default Qr;