/*
 * @Description: Api 封装
 */
import superagent from 'superagent';
 
const methods = [
  'get',
  'head',
  'post',
  'put',
  'del',
  'options',
  'patch'
]
 
export default class Api {
  constructor(opts) {
    this.opts = opts || {};
    if (!this.opts.baseURI) {
      throw new Error('baseURI option is requiresd');
    }
 
    const _self = this;
    methods.forEach(method => {
      _self[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](_self.opts.baseURI + path);
        if (params) {
          request.query(params);
        }
 
        if (_self.opts.headers) {
          request.set(_self.opts.headers);
        }
 
        if (data) {
          request.send(data);
        }
 
        request.end((err, { body, text } = {} ) => {
          return err ? reject(body || text || err) : resolve(body || text);
        });
      });
    });
  }
}