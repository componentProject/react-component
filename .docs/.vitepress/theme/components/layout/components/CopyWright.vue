<template>
  <footer>
    Powered by
    <a href="https://github.com/moluoxixi/" target="_blank" title="作者"
      >moluoxixi</a
    >
    | Copyright © 2019-{{ date }} | MIT License
  </footer>
</template>
<script lang="ts" setup>
const date = new Date().getFullYear();
</script>
<style scoped>
footer {
  text-align: center;
  width: 100%;
  padding: 20px 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
}
a {
  color: var(--vp-c-brand);
  font-weight: bold;
}
a:hover {
  text-decoration: none;
  color: var(--vp-c-hover);
}
</style>
