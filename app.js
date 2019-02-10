// Budget Controller
let budgetController = ( function() {

	let Expenses = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	let Incomes = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	Expenses.prototype.calcExpPercentage = function(totalIncome) {
		if(totalIncome > 0) {
		this.percentage = Math.floor( (this.value / totalIncome)*100);		
		} else {
			this.percentage = -1;
		}
	};

	Expenses.prototype.getExpPercentage = function() {
		return this.percentage; 
	};

	let data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	}

	function calculateTotal(type) {
		let sum = 0;
		data.allItems[type].forEach(function(element) {
			sum += element.value;
		});
		data.totals[type] = sum;
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
		},

		deleteItem: function(type, id) {
			let ids, index;
			// ids = [2, 4, 6, 8]
			ids =  data.allItems[type].map(function(element) {
				return element.id;
			});
			index = ids.indexOf(id);

			if( index !== -1) {
				data.allItems[type].splice(index, 1);
			}

		},


		calculateBudget: function() {

			// Calculate the total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// Calculate the budget : income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			// Calculate the percentage of income that was spent
			if(data.totals.inc > 0){
			data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},
		calculateExpensesPercentage: function() {
			data.allItems.exp.forEach( function(element) {
				element.calcExpPercentage(data.totals.inc);
			});
		},

		getExpensesPercentages: function() {
			let allPerc;
			allPerc = data.allItems.exp.map( function(element) {
				return element.getExpPercentage();
			});

			return allPerc;
		},
		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
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
		inputButton: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};
	let formatNumber = function(num, type) {

	let numSplit, int, dec;
		/* 
			+ or - before number
			exactly 2 decimal points
			comma seperating the thousands

			2305.567 ---> 2,305.56
			2000 ---> 2,000.00
		*/

	num = Math.abs(num);
	num = num.toFixed(2);

	numSplit = num.split('.');

	int = numSplit[0];
	if(int.length > 3) {
		int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3) 
	}

		dec = numSplit[1];

		return (type === 'exp'? '-': '+') +  ' ' + int + '.' + dec;
	};

	let nodeListForEach =  function(list, callback) {
			for( let i = 0; i < list.length; i++) {
				callback(list[i], i);
			}
		};


	return {
		getInput : function() {
			return {
			type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
			description: document.querySelector(DOMStrings.inputDescription).value,
			value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
			};
		},
		addListItem: function(obj, type) {
			let html, newHtml, element;
			// Create HTML string with placeholder

			if (type === 'exp') {
				element = DOMStrings.expensesContainer;
			html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
		} else if (type === 'inc') {
			element = DOMStrings.incomeContainer;
			html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
		}
			// Replace the place holder text with actual data

			newHtml = html.replace('%id%', obj.id); 
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			// Insert the HTML into the DOM

			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},
		deleteListItem: function(selectorId) {
			let elementToDelete;
			elementToDelete =  document.getElementById(selectorId);
			elementToDelete.parentNode.removeChild(elementToDelete);


		},
		clearFields: function() {
			let fieldsList, fieldsArr;
			fieldsList = document.querySelectorAll(DOMStrings.inputDescription+ ', ' + DOMStrings.inputValue);
			fieldsArr = Array.prototype.slice.call(fieldsList);
			fieldsArr.forEach(function(element, i, arr) {
				element.value = "";
			});
			fieldsArr[0].focus();
		},
		displayBudget: function(obj) {
			let type;
			obj.budget > 0 ? type = 'inc' : 'exp';
			document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
			

			if(obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';			
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage = '---';
			}
		},


		displayPercentages: function(percentages) {
			let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
			nodeListForEach(fields, function(element, index) {
				if(percentages[index] > 0) {
					element.textContent = percentages[index] + '%';
				} else {
					element.textContent = '---';

				}
			});
		},
		displayMonth: function() {
			let now, monthsArray, month, year;
			 now = new Date();
			 monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			 month = now.getMonth();
			 year = now.getFullYear();
			 document.querySelector(DOMStrings.dateLabel).textContent = monthsArray[month] + ', ' + year;

		},
		changedType: function() {
			let fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
			nodeListForEach(fields, function(element) {
				element.classList.toggle('red-focus');
			});
			document.querySelector(DOMStrings.inputButton).classList.toggle('red');

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
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);	
		document.addEventListener('keypress', function(e) {
			if(e.keyCode === 13 || e.which === 13) {
			ctrlAddItem();
			}
		});
	};

	let updateBudget = function() {
		// 1.) Calculate the budget
		budgetCtrl.calculateBudget();

		// 2.) return budget 
		let budget = budgetCtrl.getBudget();

		// 3.) Display the budget on the UI
		UICtrl.displayBudget(budget);
	};

	let updateExpensesPercentage = function() {
		// 1.) Calculate the percentage
		budgetCtrl.calculateExpensesPercentage();

		// 2.) Read the percentages from the budget controller
		let percentages = budgetCtrl.getExpensesPercentages(); 

		// 3.) Update the UI with the new percentages
		UICtrl.displayPercentages(percentages);

	};

	let ctrlAddItem = function() {
		let input, newItem;
		// 1.) Get the filled input data
		input = UICtrl.getInput();

		// 2.) Add the item to the budget controller
		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		// 3.) Add the item to the UI
		UICtrl.addListItem(newItem, input.type);

		//4.) Clear input fields
		UICtrl.clearFields(); 
		}
		
		//5.) update budget
		updateBudget();

		//6.) Calculate and update expenses percentage
		updateExpensesPercentage();

	};

	let ctrlDeleteItem =  function(e) {
		let itemID, splitID, type, ID;

		itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

		if(itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			//1.) Delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);

			//2.) Delete the item from the UI
			UICtrl.deleteListItem(itemID);

			//3.) update and show the budget 
			updateBudget();

			//4.) Calculate and update expenses percentage
			updateExpensesPercentage();
		}

	};

	return {
		init: function() {
			setupEventListeners();
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
		}
	};

})(budgetController, UIController);
controller.init();