<script setup lang="ts">
import HelloWorld from './components/hello-world.vue';

defineOptions({
  name: 'App',
});
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" class="mx-auto" />
  <hello-world msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<style lang="scss">
@import './testStyleImport.scss';
#app {
  margin-top: 60px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
