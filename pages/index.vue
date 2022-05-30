<script setup lang="ts">
const navs = [
  { path: '/tools/bilibili', label: '哔哩哔哩' },
]
</script>

<template>
  <div h-screen flex="~ col" mb-10 items-center justify-center>
    <p
      i-mdi-tools
      w-15
      h-15
      opacity-80
      mb-10
    />
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
