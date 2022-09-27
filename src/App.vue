<template>
  <zg-tree @collapseChange="collapseChange"></zg-tree>
</template>

<script>
import zgTree from './components/ZgTree/ZgTree.vue';
export default {
  name: 'App',
  components: {
    zgTree
  },
  methods: {
    collapseChange(item, index) {
    },
  }
}
</script>

<style>
body,html {
  padding: 0;
  margin: 0;
}
</style>
