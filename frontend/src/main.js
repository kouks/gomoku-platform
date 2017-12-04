import Vue from 'vue'
import App from './App'
import routes from './routes'
import Router from 'vue-router'

Vue.use(Router)

export default new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router: new Router({ routes })
})
