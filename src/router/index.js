import Vue from 'vue';
import Router from 'vue-router';
import CommonComponent from '@/components/common-component';

Vue.use(Router);

export default new Router({
	routes: [{
		path: '/',
		name: 'CommonComponent',
		component: CommonComponent
	}]
});