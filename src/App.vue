<template>
  <VerticalBar style="height: 800px"></VerticalBar>
</template>

<script>
import VerticalBar from './components/VerticalBar/client.vue';
export default {
  name: 'App',
  components: {
    VerticalBar
}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
