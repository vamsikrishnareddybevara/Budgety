// Budget Controller

let budgetController = ( function() {




})();


// UI Controller

let UIController = ( function() {





})();


// App Controller

let controller = ( function( budgetCtrl, UICtrl) {
	let ctrlAddItem = function() {

	// 1.) Get the filled input data
	// 2.) Add the item to the budget controller
	// 3.) Add the item to the UI
	// 4.) Calculate the budget
	// 5.) Display the budget on the UI


	}



	document.querySelector('click', ctrlAddItem);
	document.querySelector('keypress', function(e) {
		if(e.keyCode === 13 || e.which === 13) {
			ctrlAddItem();
		}
	});



})(budgetController, UIController);