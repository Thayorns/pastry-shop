import React, { useState, useEffect }from "react";
import { Spin } from "antd";

import './contacts.css';
import '../../app/styles/normalize.css';
import '../../app/styles/vars.css';

const Contacts: React.FC = () => {
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = require('./shef-patisserie.jpg');
        img.onload = () => setImageLoaded(true);
    }, []);

    return (

        <>
            {imageLoaded === false && (<Spin/>)}

            {imageLoaded === true && (
                <div className="contacts-wrapper">
                    <div className="contacts-bg-wrapper">
                        <div className="contacts-inner">
                            
                            <div className="hello-div">
                                <p>Давайте знакомиться!</p> 
                                <h3><strong>Антон Оськин</strong></h3>
                                <p>шеф-кондитер КРЕМ и КОРЖ.</p> 
                            </div>
                            <img src={require('./shef-patisserie.jpg')} alt=""/>

                        </div>
                        <p>
                            Начиная с обучения в международном университете SWISSAM, Антон прошел многолетний путь от повара до су-шефа, включая работу под началом шеф-повара и новатора в кулинарии - <strong>Аллена Дюкаса</strong>.
                        </p>
                        <p>
                            Со временем Антон отдал предпочтение тортам и выпечке, осознав, что действительно вкусной и, что самое важное, <strong>качественной</strong> по составу и внутреннему наполнению продукции так не хватает Петербургу. 
                        </p>
                        <p>
                            Но, как ценитель кулинарии, Антон постепенно вводит проверенные временем позиции кулинарных блюд. Весь ассортимент отражён в ленте раздела "дом".
                        </p>
                        <p>
                            Кстати, на бармена Антон тоже выучился, но в своей кондитерской из напитков предлагает пока только кофе...
                        </p>
                    </div>
                    
                </div>
            )}
        </>
        
        

        
    )
}
export default Contacts;