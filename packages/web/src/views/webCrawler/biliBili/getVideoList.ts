import request from "@/request";
import apiList from "request/apiList";
import {message} from 'ant-design-vue';
import {ref} from "vue";
import {TableColumnType} from "ant-design-vue";
import dayjs from "dayjs";

export interface VideoResponse {
    comment: number,
    created: number,
    id: number,
    play: number,
    title: string
}

export interface VideoList extends VideoResponse {
    createdAt: string
}


export const tableMap: TableColumnType<VideoResponse>[] = [
    {
        title: '视频ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '播放量',
        dataIndex: 'play',
        key: 'play',
        sorter: (a: VideoResponse, b: VideoResponse) => a.play - b.play
    },
    {
        title: '评论数',
        dataIndex: 'comment',
        key: 'comment',
        sorter: (a: VideoResponse, b: VideoResponse) => a.comment - b.comment
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (a: VideoResponse, b: VideoResponse) => a.created - b.created
    },
    {
        title: '导出',
        dataIndex: 'export',
        key: 'export',
    },
];

export const videoList = ref<VideoResponse[]>([]);

export const getVideoList = async (uid: string): Promise<void> => {
    try {
        const [err, res] = await request({
            api: apiList.videoList,
            url: apiList.videoList.url.replace('{uid}', uid)
        })
        if (res && res.code === 0) {
            videoList.value = (res.data as VideoResponse[]).map(v => {
                return {
                    ...v,
                    createdAt: dayjs(v.created * 1000).format('YYYY-MM-DD HH:mm:ss')
                }
            }) as VideoList[];
        } else {
            const msg: string = err.message || res.message || '请求失败';
            message.warn(msg);
        }
    } catch (e) {
        const msg = (e as any).message;
        message.warn(msg || '请求失败');
    }
}
