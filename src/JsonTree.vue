<script setup>
defineProps({value:{required:true},label:{default:'$'},depth:{default:0}});
</script>
<template><details v-if="value!==null&&typeof value==='object'" :open="depth<1" class="json-tree"><summary>{{label}} · {{Array.isArray(value)?'Array':'Object'}} ({{Object.keys(value).length}})</summary><JsonTree v-for="(item,key) in value" :key="key" :value="item" :label="String(key)" :depth="depth+1"/></details><div v-else class="json-leaf"><b>{{label}}</b>: {{JSON.stringify(value)}}</div></template>
