<!--  -->
<template>
  <div class="wrapper">
    <Header class="Header">头</Header>
    <div class="container">
      <Aside class="Aside">侧边栏</Aside>
      <Conrtent class="Content">内容</Conrtent>
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

.Header {
  width: 100%;
  height: 80px;
  background-color: azure;
}

.container {
  display: flex;
  height: calc(~'100% - 80px');
}

.Aside {
  width: 180px;
  background-color: grey;
}

.Content {
  background-color: blanchedalmond;
  flex: 1;
}
</style>
