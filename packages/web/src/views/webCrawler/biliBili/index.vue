<script setup lang="ts">
import {message} from 'ant-design-vue';
import {getVideoList, videoList, tableMap, VideoResponse} from "./getVideoList";
import {exportComments} from "./exportComments";
import {ref} from "vue";

const isLoading = ref(false);

const onSearch = async (p: string) => {
  if (!p) return message.warning('请输入哔哩哔哩用户ID');
  isLoading.value = true;
  await getVideoList(p);
  isLoading.value = false;
}

const exportHandle = async (record: VideoResponse) => {
  const {id, title} = record;
  isLoading.value = true;
  await exportComments(id, title);
  isLoading.value = false;
}
</script>

<template>
  <div class="container">
    <a-spin size="large" :spinning="isLoading">
      <a-input-search
        placeholder="输入哔哩哔哩用户ID"
        enter-button
        @search="onSearch"
        class="search"
      />

      <a-table :dataSource="videoList" :columns="tableMap" >
        <template #bodyCell="{column, record}">
          <template v-if="column.key === 'export'">
            <span class="link" @click="exportHandle(record)">导出</span>
          </template>
        </template>
      </a-table>
    </a-spin>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 50px 0;

  .search {
    width: 300px;
    display: grid;
    margin: auto auto 20px;
  }

  .link {
    color: $color-blue;
    cursor: pointer;
  }
}
</style>
