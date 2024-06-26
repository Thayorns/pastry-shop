import React from "react";

import './news.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'

const News: React.FC = () => {
    return (
        <div>
            <div className="news-wrapper">
                <div className="news-bg-wrapper">


                    <div className="news-inner">
                        <div className="coffee">
                            <p>каждый <strong>восьмой</strong> кофе в подарок</p>
                            <span>для авторизованных пользователей приложения</span>
                        </div>
                        <div className="bakery">
                            <p>скидка <strong>30%</strong> на вчерашнюю выпечку</p>
                        </div>
                        <div className="order-cake">
                            <p><strong>торт на заказ</strong></p>
                            <span>для авторизованных пользователей приложения</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
export default News;