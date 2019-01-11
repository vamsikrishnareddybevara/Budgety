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
	}
	return {
		addItem: function(type, des, val) {
			let ID, newItem;

			// Create unique ID
			if(data.allItems[type].length > 0){
			ID = data.allItems[type][data.allItems[type].length-1]+1;
			}

			ID = 0;

			// Add new item to the data structure
			if(type === 'exp') {
				newItem = new Expenses(ID, des, val);

			}
			else if(type === 'inc') {
				newItem = new Incomes(ID, des, val);
			}
			// Push it into the Data Structure
			data.allItems[type].push(newItem);

			// Return the element
			return newItem;
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
		addListitem: function(obj, type) {
			let html;
			// Create HTML string with placeholder
			if (type === 'exp') {
			html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
		} else if (type === 'inc') {
			html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
		}
			// Replace the place holder text with actual data

			newHtml = html.replace('%id%', obj.id); 
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);
			// Insert the HTML into the DOM
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
		let input, newItem;
		// 1.) Get the filled input data
		input = UICtrl.getInput();
		// 2.) Add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
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