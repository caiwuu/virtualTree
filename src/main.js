/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-10-20 16:37:58
 */
import { createApp } from 'vue'
import { VirtualTree } from '../dist/virtualTree.umd.js'
import '../dist/virtualTree.css'
import App from './App.vue'

createApp(App).use(VirtualTree).mount('#app')
