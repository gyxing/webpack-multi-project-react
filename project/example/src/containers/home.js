import React, {Component} from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from "react-router-dom";
import { changeName } from '../modules/reducers/home/actions';

class Home extends Component {
    constructor(props) {
        super(props);
    }
    handleClick = () => {
        const {changeName} = this.props;
        changeName(new Date().getTime());
    };
    render() {
        const {name} = this.props.info;
        return (
            <div>
                home page
                <div className="main">
                    <h1>hello , I am ok</h1>
                    <div>
                        <img src={require('../img/question.png')} alt=""/>
                        <span className="icon"></span>
                    </div>
                </div>
                <div style={{margin:10}}>
                    <div>
                        <span>这个名字：</span>
                        <span>{name}</span>
                    </div>
                    <button onClick={this.handleClick}>改变名字</button>
                </div>
                <div className="links">
                    <Link to='/detail'>详情页</Link>
                    <Link to='/user'>个人中心</Link>
                    <Link to='/xxx'>不知啥页面</Link>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({ info: state.home }),
    dispatch => ({
        changeName: bindActionCreators(changeName, dispatch),
    })
)(Home);
