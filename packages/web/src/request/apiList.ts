interface ApiListType {
  [propName: string]: ApiType;
}

export interface ApiType {
  url: string;
  method: 'get' | 'post' | 'delete' | 'put';
}

const BASE_URL = '/baseApi'

const apiList: ApiListType = {
  videoList: {
    url: BASE_URL + '/api/crawler/bili-bili/video-list/{uid}',
    method: 'get'
  },
  commentList: {
    url: BASE_URL + '/api/crawler/bili-bili/comments-list/{vid}',
    method: 'get'
  }
};

export default apiList;
