// Budget Controller

let budgetController = ( function() {

	let Expenses = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	let Incomes = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	let data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	return {
		addItem: function(type, des, val) {
			let ID, newItem;
			// Add new item to the data structure
			if(type === 'exp') {
				newItem = new Expenses(id, des, val);

			}
			else if(type === 'inc') {
				newItem = new Incomes(id, des, val);
			}

			data.allItems[type].push(newItem);
			return newItem;
		}
	}
};


})();


// UI Controller

let UIController = ( function() {
	let DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputButton: '.add__btn'
	}
 


	return {
		getInput : function() {
			return {
			type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
			description: document.querySelector(DOMStrings.inputDescription).value,
			value: document.querySelector(DOMStrings.inputValue).value 
			};
		},
		getDOMStrings: function() {
			return DOMStrings;
		}
	};
})();


// App Contrller

let controller = ( function( budgetCtrl, UICtrl) {
	let setupEventListeners = function() {
		let DOM = UICtrl.getDOMStrings();
		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);	
		document.addEventListener('keypress', function(e) {
			if(e.keyCode === 13 || e.which === 13) {
			ctrlAddItem();
			}
		});
	};
	let ctrlAddItem = function() {
		// 1.) Get the filled input data
		let input = UICtrl.getInput();
		// 2.) Add the item to the budget controller
		// 3.) Add the item to the UI
		// 4.) Calculate the budget
		// 5.) Display the budget on the UI
	};	

	return {
		init: function() {
			setupEventListeners();
		}
	};

})(budgetController, UIController);
console.log(controller);
controller.init();