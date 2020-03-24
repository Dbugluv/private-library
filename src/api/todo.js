import { AjaxServer } from './index'
 
export async function getTodoList(params) {
  return AjaxServer('get', '/app/todolist', params);
}