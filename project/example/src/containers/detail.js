import React from 'react'
import { Link } from "react-router-dom";

export default () => (
    <div>
        detail page
        <div className="links">
            <Link to='/'>首页</Link>
            <Link to='/user'>个人中心</Link>
        </div>
    </div>
)
