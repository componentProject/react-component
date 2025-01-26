<template>
  <Layout>
    <template #doc-before>
      <Title />
      <Category />
    </template>
    <template #doc-after>
      <div>
        <button @click="back">cd ··</button>
      </div>
      <Comments />
    </template>
    <!-- Home slot-->
    <template #home-hero-before><HomeHero /></template>
    <template #home-features-after><Page /></template>
  </Layout>
  <!-- copywright -->
  <CopyWright />
</template>
<script lang="ts" setup>
import DefaultTheme from "vitepress/theme";
import HomeHero from "./components/HomeHero.vue";
import CopyWright from "./components/CopyWright.vue";
import Comments from "./components/Comments.vue";
import Page from "./components/Page/index.vue";
import Category from "./components/Category.vue";
import Title from "./components/Title.vue";
const { Layout } = DefaultTheme;
const back = () => {
  history.back();
};
</script>
<style scoped>
button {
  display: inline-block;
  position: relative;
  color: var(--vp-c-color-d);
  cursor: pointer;
  font-size: 1.2em;
  font-weight: bold;
}

button::after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--vp-c-color-d);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}
button:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
</style>
