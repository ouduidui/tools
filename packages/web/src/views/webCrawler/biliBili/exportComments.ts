import request from "@/request";
import apiList from "request/apiList";
import {message} from "ant-design-vue";
import {ExportToExcel} from "utils/exportToExcel";
import dayjs from "dayjs";

interface PaginationType {
  page: number,
  limit: number,
  pages: number,
  total: number
}

interface CommentType {
  member: {
    uid: string,
    name: string,
    sex: string,
    level: number
  },
  content: string,
  created: number,
  like: number,
  reply: number
}

let localComments: CommentType[] = [];

export const exportComments = async (vid: number, title: string) => {
  const isSuccess:boolean = await getComments(vid);
  if(isSuccess) {
    await new ExportToExcel().export(CommentsFormat(), title);
  }
}

const getComments = async (vid: number): Promise<boolean> => {
  let page = 1;
  localComments = [];
  const {success, data} = await _getComments(vid, page);
  if (!success) return false;

  const {pagination, comments}: { pagination: PaginationType, comments: CommentType[] } = data;
  localComments.push(...comments);
  if (pagination.pages > 1) {
    while (page < pagination.pages) {
      page++;
      const {success, data} = await _getComments(vid, page);
      if (!success) return false;
      localComments.push(...data.comments);
    }
  }

  return true;
}

const _getComments = async (vid: number, page: number): Promise<{ success: boolean, data?: any }> => {
  try {
    const [err, res] = await request({
      api: apiList.commentList,
      url: apiList.commentList.url.replace('{vid}', vid.toString()),
      query: {
        page
      }
    })
    if (res && res.code === 0) {
      return {
        success: true,
        data: res.data
      }
    } else {
      const msg: string = err.message || res.message || '请求失败';
      message.warn(msg);
      return {
        success: false
      }
    }
  } catch (e) {
    const msg = (e as any).message;
    message.warn(msg || '请求失败');
    return {
      success: false
    }
  }
}

const CommentsFormat = (): any[] => {
  return localComments.map(c => {
    return {
      '用户名称': c.member.name,
      '用户id': c.member.uid,
      '用户等级': c.member.level,
      '用户性别': c.member.sex,
      '评论内容': c.content,
      '评论回复数': c.reply,
      '评论点赞数': c.like,
      '评论时间': dayjs(c.created * 1000).format('YYYY-MM-DD HH:mm:ss')
    }
  })
}
