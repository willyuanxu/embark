import Route from '@ember/routing/route';

export default Route.extend({
	title: "Travel Plans",
	model(){
		return this.store.findAll('plan');
	}
});
