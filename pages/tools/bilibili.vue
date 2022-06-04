<script setup lang="ts">
/* eslint-disable vue/no-deprecated-v-on-native-modifier */
import {
  ElEmpty,
  ElInput,
  ElPagination,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import dayjs from 'dayjs'

interface VideoItemType {
  id: number
  title: string
  comment: number
  play: number
  created: number
}

interface Paginator {
  currentPage: number
  total: number
  pageSize: number
  totalPage: number
}

const { query } = useRoute()

const localUid = query.uid || ''
const uid = ref(localUid)
const videoList = ref<VideoItemType[]>()
const paginator = ref<Paginator>()
const currentPage = ref<number>(query.page || 1)

const getVideoList = async(uid: string, page = 1) => {
  try {
    const { data: res, error } = await useFetch(`/api/bilibili/list/${uid}?page=${page}`)
    if (error.value) {
      useMsg(error.value, 'warning')
    }
    else {
      const { code, message, data } = res.value
      if (code === 1) {
        videoList.value = data.list
        paginator.value = data.page
        paginator.value.totalPage = Math.ceil(paginator.value.total / paginator.value.pageSize)
      }
      else { useMsg(message, 'warning') }
    }
  }
  catch (e) {
    useMsg(e.value, 'warning')
  }
}

if (localUid)
  await getVideoList(localUid, currentPage.value)

const router = useRouter()

const search = () => {
  if (uid.value || uid.value !== localUid)
    router.push(`/tools/bilibili?uid=${uid.value}&page=${currentPage.value}`)
  else useMsg('请输入用户ID', 'warning')
}

const timestampFormatter = (row, col, val) => dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss')

watch(currentPage, () => router.push(`/tools/bilibili?uid=${uid.value}&page=${currentPage.value}`))
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
