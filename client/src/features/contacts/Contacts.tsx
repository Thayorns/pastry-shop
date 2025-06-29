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
                                <p>Let's get acquainted!</p> 
                                <h3><strong>Anton Chelentano</strong></h3>
                                <p>Pastry Chef</p> 
                            </div>
                            <img src={require('./shef-patisserie.jpg')} alt=""/>

                        </div>
                        <p>
                            Since studying at the international university SWISSAM, Anton has come a long way from a cook to an assistant chef, including working under the head chef and culinary innovator - <strong>Allen Ducasse</strong>.
                        </p>
                        <p>
                            Over time, Anton gave preference to cakes and pastries, realizing that they are really tasty and, most importantly, <strong>quality</strong> the city lacks the composition and internal content of its products. 
                        </p>
                        <p>
                            But, as a culinary expert, Anton gradually introduces time-tested culinary dishes. The entire range is reflected in the feed of the "home" section.
                        </p>
                        <p>
                            By the way, Anton also studied to be a bartender, but in his pastry shop he only offers coffee for now...
                        </p>
                    </div>
                    
                </div>
            )}
        </>
        
        

        
    )
}
export default Contacts;