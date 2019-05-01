import Vue from 'vue'
import App from './App.vue'

//Vue.prototype.$serv = 'http://localhost/voting_back/';
Vue.prototype.$serv = 'https://ceosonweb.alwaysdata.net/vote_back/';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
