<script setup lang="ts">
/* eslint-disable vue/no-deprecated-v-on-native-modifier */
import {
  ElButton,
  ElEmpty,
  ElInput,
  ElPagination,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import dayjs from 'dayjs'
import axios from 'axios'

interface VideoItemType {
  id: number
  title: string
  comment: number
  play: number
  created: number
  bvid: string
}

interface Paginator {
  currentPage: number
  total: number
  pageSize: number
  totalPage: number
}

const { query } = useRoute()

const localUid = query.uid as string || ''
const uid = ref(localUid)
const videoList = ref<VideoItemType[]>()
const paginator = ref<Paginator>()
const currentPage = ref<number>(Number(query.page) || 1)

interface BVideoListResponseType {
  list: {
    id: number
    bvid: string
    title: string
    play: number
    comment: number
    created: number
  }[]
  page: {
    total: number
    currentPage: number
    pageSize: number
  }
}

interface BVideoCommentType {
  content: string
  created: number
  like: number
  reply: number
  member: {
    uid: string
    name: string
    sex: string
    level: number
  }
}

interface BVideoCommentListResponseType {
  list: BVideoCommentType[]
  page: {
    total: number
    currentPage: number
    pageSize: number
  }
}

const getVideoList = async(uid: string, page = 1) => {
  try {
    const { data: res } = await axios(`/api/bilibili/list/${uid}?page=${page}`)
    const { code, message, data } = res
    if (code === 1) {
      const { list, page } = data as BVideoListResponseType
      videoList.value = list
      paginator.value = {
        ...page,
        totalPage: Math.ceil(page.total / page.pageSize),
      }
    }
    else { useMsg(message, 'warning') }
  }
  catch (e) {
    useMsg(e.message, 'warning')
  }
}

const comments: BVideoCommentType[] = []

const getCommentList = async (vid, page = 1) => {
  try {
    const { data: res } = await axios(`/api/bilibili/comments/${vid}?page=${page}`)
    const { code, message, data } = res
    if (code === 1) {
      const { list, page } = data as BVideoCommentListResponseType
      comments.push(...list)
      return page
    }
    else {
      useMsg(message, 'warning')
      return false
    }
  }
  catch (e) {
    useMsg(e.message, 'warning')
    return false
  }
}

if (localUid) await getVideoList(localUid, currentPage.value)

const router = useRouter()

const search = () => {
  if (uid.value || uid.value !== localUid)
    router.push(`/bilibili?uid=${uid.value}&page=${currentPage.value}`)
  else useMsg('请输入用户ID', 'warning')
}

const timestampFormatter = (row, col, val) => dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss')

watch(currentPage, () => router.push(`/bilibili?uid=${uid.value}&page=${currentPage.value}`))

const delayFn = (fn: () => Promise<any>, delay = 500) => new Promise(resolve => setTimeout(async() => resolve(await fn()), delay))

const detailHandle = async ({ row }) => {
  comments.length = 0
  const vid = row.id
  const commentCount = row.comment
  let closeFn = useLoading('加载中...')
  const res = await getCommentList(vid)
  if (!res) {
    closeFn()
    return
  }

  const { total, currentPage, pageSize } = res
  const totalPages = Math.ceil(total / pageSize)
  if (currentPage < totalPages) {
    for (let page = currentPage + 1; page < totalPages; page++) {
      closeFn()
      closeFn = useLoading(`${comments.length}/${commentCount}`)
      const res = await delayFn(() => getCommentList(vid))
      if (!res) {
        closeFn()
        return
      }
    }
  }
}

const toBilibiliHandle = ({ row }) => window.open(`https://www.bilibili.com/video/${row.bvid}`)
</script>

<template>
  <div container m-auto>
    <div class="mt-10 mb-5">
      <el-input
        v-model="uid"
        clearable
        placeholder="输入哔哩哔哩用户id"
        @keyup.enter.native="search"
      >
        <template #append>
          <button i-carbon-search @click="search" />
        </template>
      </el-input>
    </div>
    <template v-if="videoList && paginator">
      <el-table
        :data="videoList"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="title"
          label="标题"
        />
        <el-table-column
          prop="play"
          label="播放数"
          width="180"
        />
        <el-table-column
          prop="comment"
          label="评论数"
          width="180"
        />
        <el-table-column
          prop="created"
          label="创建时间"
          :formatter="timestampFormatter"
          width="180"
        />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button
              link
              size="small"
              class="opacity-80 hover:opacity-100"
              @click="toBilibiliHandle(scope)"
            >
              B站
            </el-button>
            <el-button
              text
              size="small"
              class="opacity-80 hover:opacity-100"
              @click="detailHandle(scope)"
            >
              导出评论
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div flex="~ col" mt-5 items-center>
        <el-pagination
          v-model:currentPage="currentPage"
          layout="prev, pager, next"
          :page-size="paginator.pageSize"
          :total="paginator.total"
        />
      </div>
    </template>
    <template v-else>
      <el-empty description="暂无搜索结果" />
    </template>
  </div>
</template>
