import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		createPlan(){
			this.transitionToRoute('explore');
		},

		deletePlan(plan){
			let confirmed = window.confirm("Are you sure you want to delete this plan");
			if (confirmed){
				plan.destroyRecord();		
			}
		},

		editName(plan, name){
			plan.set('name', name);
			this.set('editPlan', false);
			this.set('nameError', false);
			plan.save();
			
		},

		showEdit(){
			this.set('editPlan', true);
		}
	}
});
