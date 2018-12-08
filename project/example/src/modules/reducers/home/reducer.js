/*
   home 容器的状态管理
*/

// 将 action type 提取出来作为常量，防止编写错误
import {CHANGE_NAME} from '../types-constant';

// state 初始化数据
const initialState = {
    title: '首页数据',
    name: ''
};

const typesCommands = {
    [CHANGE_NAME](state, action) {
        return Object.assign({}, state, {name: action.msg});
    },
};

export default function home(state = initialState, action) {
    const actionResponse = typesCommands[action.type];
    return actionResponse ? actionResponse(state, action) : state;
}
