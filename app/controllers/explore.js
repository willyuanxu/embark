import Controller from '@ember/controller';
import RSVP from 'rsvp';
import { later } from '@ember/runloop';

export default Controller.extend({

	actions: {
		addCity(loc){
			let newLoc = this.store.createRecord('temp-city', {
				name: loc,
			});
			newLoc.save();

		},

		updateInfoCells(){
			return this.store.findAll('temp-city');
		},

		destroyInfoCells(){
			this.store.findAll('temp-city').then((cities) => {
				cities.forEach((city) => {
					city.deleteRecord();
					city.save();

				})
			})
		}
	},
	
});
