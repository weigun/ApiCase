<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <el-header style="text-align: right; font-size: 1px" height="0px"></el-header>
    <router-view/>
  </div>
</template>

<script>
import {CompCaseGenerate} from '@/components/CompCaseGenerate'
export default {
  name: 'App',
  components: {
    CompCaseGenerate
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  color: #ebcb8b;
  background:#2b303b;
  /* margin-top: 20px; */
}
.el-header{
  margin-top: 50px;
}
</style>
