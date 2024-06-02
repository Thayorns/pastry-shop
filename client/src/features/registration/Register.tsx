import React, { useState } from "react";
import { Button, Input, Spin } from 'antd';
import { useAddUserMutation } from "../api/apiSlice";

import './register.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'

const Register: React.FC = () => {
    const [addUser, { isLoading, error, isSuccess }] = useAddUserMutation()
    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({ email: userEmail, login: userName, password: userPassword})
    }
    if(isLoading){
        <Spin/>
    }
    if(isSuccess){
        return (
            <div className="success-register">
                <h2>Здравствуйте, <strong>{userName}</strong>! Вы успешно зарегистрировались!</h2>
                <p>На почту <span className="email-underlined">{userEmail}</span> отправлено письмо с активацией аккаунта</p>
                <p>Активируйте свой аккаунт, чтобы использовать наши акции, например бесплатный кофе по qr-code.</p>
                
            </div>
        )
    }
    // else if(error){
    //     return (
    //         <div className="error-register">
    //             <h2>Ошибка..</h2>
    //             <p>Пользователь с такой учётной записью уже существует!</p>
    //             <p>Попробуйте снова.</p>
    //             <button className="form-button">Зарегистрироваться</button>
    //         </div>
    //     )
    // }
    const errorDisplay: React.ReactNode = error as React.ReactNode;
    return (
        <div className="register">
            <h1>АВТОРИЗАЦИЯ</h1>
            <span>Заполните форму, чтобы создать новый аккаунт.</span>
            {errorDisplay && (
                <div className="error-register">
                    <p>Ошибка..Пользователь с такой учётной записью уже существует!</p>
                    <p>Попробуйте снова.</p>
                </div>
            ) as React.ReactNode}
            
            <form onSubmit={handleSubmit}>
                <div>
                    <Input 
                        onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserEmail( e.target.value)} 
                        value={userEmail} 
                        type="email" 
                        name="email" placeholder="Укажите Вашу почту" required
                    ></Input>
                </div>
                <div>
                    <Input 
                        onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value) } 
                        value={userName} 
                        type="text" 
                        name="username" placeholder="Ваш логин" required
                    ></Input>
                </div>
                <div>
                    <Input 
                        onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value)} 
                        value={userPassword} minLength={8}
                        type="password" 
                        name="password" placeholder="Ваш пароль" required
                    ></Input>
                </div>
                <Button htmlType="submit" type="primary" className="form-button" disabled={isLoading}>Принять</Button>
            </form>
        </div>
    )
};
export default Register;
// POLLING INTERVAL!!!!!!!!!!!!!!!!!!!!
// export const PostDetail = ({ id }: { id: string }) => {
//     const {
//       data: post,
//       isFetching,
//       isLoading,
//     } = useGetPostQuery(id, {
//       pollingInterval: 3000,
//       refetchOnMountOrArgChange: true,
//       skip: false,
//     })
  
//     if (isLoading) return <div>Loading...</div>
//     if (!post) return <div>Missing post!</div>
  
//     return (
//       <div>
//         {post.name} {isFetching ? '...refetching' : ''}
//       </div>
//     )
//   }
