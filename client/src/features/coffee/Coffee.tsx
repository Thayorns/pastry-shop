import React from "react";

import './coffee.css'
import '../../app/styles/normalize.css'
import '../../app/styles/vars.css'

const Coffee: React.FC = () => {
    return (
        <div>
            <h1>Роут для ввода кофе по qr настроен</h1>
            <p>доступен для входа только сотрудникам</p>
        </div>
    )
}
export default Coffee;