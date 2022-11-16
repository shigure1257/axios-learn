<!--  -->
<template>
  <div class="wrapper">
    <Header></Header>
    <div class="container">
      <Aside></Aside>
      <Conrtent></Conrtent>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './header/index.vue'
import Aside from './aside/index.vue'
import Conrtent from './content/index.vue'
</script>

<style lang="less" scoped>
.wrapper {
  height: 100%;
}

.container {
  display: flex;
  height: calc(~'100% - 80px');
}
</style>
