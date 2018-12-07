import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		createPlan(){
			this.transitionToRoute('explore');
		}
	}
});
