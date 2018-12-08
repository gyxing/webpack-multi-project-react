import React from 'react'
import { Link } from "react-router-dom";

export default () => (
    <div>
        user page
        <div className="links">
            <Link to='/'>首页</Link>
            <Link to='/detail'>详情页</Link>
        </div>
    </div>
)
