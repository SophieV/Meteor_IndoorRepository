Template.signs_list.helpers({
});

Template.signs_list.onCreated(function(){
	console.log(this.data.count());
	_.each(this.data, function(sign){
		console.log(sign.floor);
	});
});

Template.signs_list.events({
});