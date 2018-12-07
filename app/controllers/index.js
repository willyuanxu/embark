import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		toExplorePage(){
			this.transitionToRoute('explore');
		}
	}
});
