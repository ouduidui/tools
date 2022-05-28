<script setup lang="ts">
const { data } = await useFetch('/hello')
</script>

<template>{{ data.msg }}</template>
