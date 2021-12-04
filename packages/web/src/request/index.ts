import axios, {AxiosRequestConfig, AxiosRequestHeaders} from 'axios';
import qs from '@ouduidui/qs';
import {ApiType} from "./apiList";


interface RequestParameter {
  api: ApiType;
  url?: ApiType['url'];
  query?: RequestQuery | null;
  data?: RequestData | null;
  headers?: AxiosRequestHeaders;
}

interface RequestQuery {
  [propName: string]: any;
}

interface RequestData {
  [propName: string]: any;
}

// 拦截器
axios.interceptors.response.use(
  (res) => Promise.resolve(res),
  (error) => Promise.reject(error.response)
);

/**
 * axios封装
 * @param api {ApiType} apiList里面的对象，包括{url,method,needAuth}属性
 * @param url {ApiType.url}
 * @param query {RequestQuery} url拼接参数
 * @param data {RequestData} 请求参数
 * @param header {AxiosRequestHeaders} 额外header
 * @returns {Promise<any>}
 */
function request(
  {api, url = api.url, query = null, data = null, headers = {}}: RequestParameter
): Promise<[any, any]> {
  try {
    return new Promise((resolve) => {
      const localHeaders: AxiosRequestHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true'
      };

      // 拼接URL
      const localUrl: string = query ? url + `?${qs.stringify(query)}` : url;

      axios({
        url: localUrl,
        method: api.method,
        data,
        headers: {...localHeaders, ...headers}
      } as AxiosRequestConfig)
        .then(res => {
          const {status, data} = res;
          if (status === 200) {
            resolve([null, data]);
          } else {
            resolve([data, null]);
          }
        })
        .catch(err => resolve([err, null]));
    });
  } catch (e) {
    console.log(e);
    return Promise.resolve([e, null]);
  }
}

export default request;
