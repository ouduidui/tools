<script setup lang="ts">
const navs = [
  { path: 'bilibili', label: '哔哩哔哩' },
]
</script>

<template>
  <div h-screen flex="~ col" items-center justify-center>
    <router-link
      v-for="nav in navs"
      :key="nav.path"
      :to="nav.path"
      font-light
      text-2xl
      opacity="70 hover:100"
      border-b="1 transparent hover:current"
      mb-2
    >
      {{ nav.label }}
    </router-link>
  </div>
</template>
