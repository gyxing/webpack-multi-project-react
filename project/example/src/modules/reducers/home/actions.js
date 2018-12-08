// 将 action.type 抽取为常量，减少出错
import { CHANGE_NAME } from '../types-constant';

export function changeName(newName) {
   return { type: CHANGE_NAME, msg: newName };
}
