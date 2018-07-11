import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import CompCaseGenerate from '@/components/CompCaseGenerate'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CompCaseGenerate',
      component: CompCaseGenerate
    }
  ]
})
