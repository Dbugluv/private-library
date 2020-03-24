import Api from './api';
 
const api = new Api({
  baseURI: 'localhost:3000',// 就是后端启动的路径，如果遇到请求错误问题，可尝试写成http:// + (your local ip address) + :3000。例如我的：http://10.108.9.56:3000
  headers: {
    'Accept': '*/*',
    'Content-Type': 'text/html'
  }
});
 
export function AjaxServer(method, path, params = {}, data) { 
  return api[method](path, { params, data });
}