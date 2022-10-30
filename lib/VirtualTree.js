import VirtualTree from '@/components/wraper/Wraper.vue'
// export default {
//   install: (Vue) => {
//     Vue.component(VirtualTree.name, VirtualTree)
//   },
// }

const install = (Vue) => {
  Vue.component(VirtualTree.name, VirtualTree)
}
export default install
export { VirtualTree }
