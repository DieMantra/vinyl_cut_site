/////////////// ARTBOARD VARIABLES ///////////////
const artWidthSpan = document.getElementById('artWidth');
const artHeightSpan = document.getElementById('artHeight');
const textOutput = document.getElementById('textOutput');
const AddItemBtn = document.getElementById('addBtn');

/////////////// INPUT VARIABLES ///////////////
const inputText = document.getElementById('inputText');
const inputFont = document.getElementById('inputFont');
const inputColor = document.getElementById('inputColor');
const inputSize = document.getElementById('inputSize');

/////////////// CHECKOUT VARIABLES ///////////////
const checkoutBtn = document.getElementById('checkoutBtn');
const shareSection = document.querySelector('.copy__container');
const shareBtn = document.querySelector('.copy__button--share');

/////////////// OUTPUT VARIABLES ///////////////
const totalCostOUT = document.getElementById('invoiceTotalCost');
const invoiceHeader = document.getElementById('invoiceHeader');
/////////////// GLOBAL VARIABLES ///////////////
const invoiceSection = document.getElementById('invoiceSection');
let multiplierArr;
let simpleIterator = 0;
let globalTotalCost = 0;
/////////////// OUTPUT OBJECT ///////////////
let currOutputObj = {
	id: '',
	currCost: 0,
	size: '',
	cost: 0,
	min: 0,
	color: '',
	font: '',
	text: '',
};
let invoiceObj = {};
/////////////// EVENT LISTENERS ///////////////
inputSize.addEventListener('change', (e) => {
	const size = e.target.options[event.target.selectedIndex].dataset.size;
	const cost = e.target.options[event.target.selectedIndex].dataset.cost;
	const min = e.target.options[event.target.selectedIndex].dataset.min;
	const storeID = e.target.options[event.target.selectedIndex].dataset.id;
	addSize(size, cost, min, storeID);
});
inputText.addEventListener('keyup', (e) => {
	const text = e.currentTarget.value;
	addText(text);
});
inputColor.addEventListener('change', (e) => {
	const color = e.currentTarget.value;
	addColor(color);
});
inputFont.addEventListener('change', (e) => {
	const font = e.currentTarget.value;
	const fontName = inputFont[inputFont.selectedIndex].textContent;
	addFont(font, fontName);
	addText(currOutputObj.text);
});

shareSection.addEventListener('click', function (e) {
	const shareBtn = e.target.closest('.copy__button--share');
	if (!shareBtn) return;
	shareOrder();
});

function addFont(font, name) {
	currOutputObj.font = name;
	textOutput.dataset.font = font;
}
function addColor(color) {
	currOutputObj.color = color;
	textOutput.dataset.clr = color;
}
function addText(text) {
	if (currOutputObj.font === 'font3') {
		textOutput.innerHTML = text.toUpperCase();
		currOutputObj.text = text;
	} else currOutputObj.text = textOutput.innerHTML = text;
}
function addSize(size, cost, min, storeID) {
	currOutputObj.size = size;
	currOutputObj.cost = cost;
	currOutputObj.min = min;
	currOutputObj.id = storeID;
	currOutputObj.currCost = cost * min;

	let z = size.replaceAll('m', '');
	let [x, y] = z.split('x');
	artWidthSpan.innerHTML = `${x}mm`;
	artHeightSpan.innerHTML = `${y}mm`;
}
const costMultiplier = function (cost, multiplier) {
	let x = cost * multiplier;
	return x.toFixed(2);
};
function addItem(obj) {
	if (obj.font === '' || obj.text === '' || obj.color === '' || obj.size === '')
		return alert(`Make Sure You Fill Out All The Options!`);
	AddItemBtn.classList.add('flashWhite');
	AddItemBtn.addEventListener('animationend', () => {
		AddItemBtn.classList.remove('flashWhite');
	});
	let randID = Date.now();
	let min = obj.min;
	simpleIterator++;
	invoiceObjAdd(obj, randID, simpleIterator);
	// CONTAINER
	let invoiceItem = document.createElement('div');
	invoiceItem.classList = 'invoice__item';
	invoiceItem.id = randID;
	invoiceSection.appendChild(invoiceItem);

	// BTN
	let btn = document.createElement('button');
	btn.classList = 'invoice__item--btn';
	btn.setAttribute('onclick', `clearItem(${invoiceItem.id})`);
	invoiceItem.appendChild(btn);

	// DIV - DESC CONTAINER
	let invoiceDescContainer = document.createElement('div');
	invoiceDescContainer.classList = 'invoice__item__desc';
	invoiceItem.appendChild(invoiceDescContainer);

	// SPANS - DESC
	let invoiceText = document.createElement('span');
	let invoiceClrFont = document.createElement('span');
	let invoiceSize = document.createElement('span');
	let invoiceDescArr = [invoiceText, invoiceClrFont, invoiceSize];
	invoiceText.classList = 'invoice__item__desc--text';
	invoiceClrFont.classList = 'invoice__item__desc--clr-font';
	invoiceSize.classList = 'invoice__item__desc--size';
	invoiceText.innerHTML = obj.text;
	invoiceClrFont.innerHTML = `${obj.color} | ${obj.font}`;
	invoiceSize.innerHTML = `${obj.size} | $${obj.cost}ea | *min ${min}`;
	invoiceDescArr.forEach((element) => {
		invoiceDescContainer.appendChild(element);
	});
	// DIV - MULTIPLIER CONTAINER
	let multiplierContainer = document.createElement('div');
	multiplierContainer.classList = 'invoice__item--multiplier--wrap';
	invoiceItem.appendChild(multiplierContainer);
	// MULTI SELECT OPTIONS
	let multiplierSelect = document.createElement('select');
	multiplierSelect.classList = 'invoice__item--multiplier';
	multiplierSelect.id = `multiplierID${randID}`;
	multiplierContainer.appendChild(multiplierSelect);
	for (let i = min; i < 31; i++) {
		let option = document.createElement('option');
		option.value = i;
		option.innerHTML = `x${i}`;
		multiplierSelect.appendChild(option);
	}
	// SPAN - COST
	let costSpan = document.createElement('span');
	costSpan.classList = 'invoice__item--cost';
	costSpan.id = `costID${randID}`;
	costSpan.innerHTML = `$${costMultiplier(obj.cost, obj.min)}`;
	invoiceItem.appendChild(costSpan);

	multiplierArr = document.getElementById(`${multiplierSelect.id}`);
	multiplierArr.addEventListener('change', (e) => {
		const costID = e.currentTarget.id.replace('multiplierID', 'costID');
		const randID = e.currentTarget.id.replace('multiplierID', '');
		const cost = invoiceObj[randID].cost;
		const x = e.currentTarget.value;
		const span = document.getElementById(costID);
		span.innerHTML = `$${costMultiplier(cost, x)}`;
		invoiceObj[randID].currCost = costMultiplier(cost, x);
		invoiceObj[randID].min = x;
		tallyTotal(invoiceObj);
	});
	tallyTotal(invoiceObj);
}

function clearItem(elementID) {
	const element = document.getElementById(elementID);
	element.classList.add('flashRed');
	setTimeout(() => {
		element.remove();
		delete invoiceObj[elementID];
		tallyTotal(invoiceObj);
	}, '500');
}

function invoiceObjAdd(obj, randID, i) {
	invoiceObj[randID] = Object.assign({}, obj);
}
const tallyTotal = function (obj) {
	let t = 0;
	for (const key in obj) {
		let totalNum = Number(obj[key].currCost);
		t += totalNum;
	}
	globalTotalCost = t.toFixed(2);
	totalCostOUT.innerHTML = `$${t.toFixed(2)}`;
};

function copyInvoice(obj, share = false) {
	let str = ``;
	const copyBtn = document.getElementById('copyBtn');

	for (const key in obj) {
		if (obj.hasOwnProperty.call(obj, key)) {
			const text = obj[key].text;
			const totalCost = obj[key].currCost.toFixed(2);
			const multiplier = obj[key].min;
			const size = obj[key].size;
			const color = obj[key].color;
			const font = obj[key].font;
			const splitKey = key.slice(-5);

			str += `ID: ${splitKey} \n| TEXT: ${text}\n| FONT: ${font} | COLOUR: ${color}\n| SIZE: ${size} | QTY: ${multiplier}\n| TOTALCOST: $${totalCost}\n----------------------\n`;
		}
	}
	if (share) return `Total Order: $${globalTotalCost}\n${str}`;
	copyBtn.classList.add('flashGreen');
	copyBtn.innerHTML = 'Copied To Clipboard!';
	setTimeout(() => {
		copyBtn.innerHTML = 'Copy Order To Clipboard';
	}, '2000');
	copyBtn.addEventListener('animationend', () => {
		copyBtn.classList.remove('flashGreen');
	});
	navigator.clipboard.writeText(`Total Order: $${globalTotalCost}\n${str}`);
}

const shareOrder = async function () {
	const invoice = copyInvoice(invoiceObj, (share = true));
	if (invoice.split('\n')[1] === '') {
		shareBtn.textContent = `Your cart seems to be empty? 🤨`;
		setTimeout(() => {
			shareBtn.textContent = 'Share Order!';
		}, '5000');
		return;
	}
	if (navigator.share) {
		try {
			await navigator.share({
				invoice,
				title: 'Order Invoice',
				text: `${invoice}`,
			});
			shareBtn.textContent = 'Shared!';
		} catch (error) {
			shareBtn.textContent = `Error: ${error.message}`;
			setTimeout(() => {
				shareBtn.textContent = 'Share Order!';
			}, '5000');
		}
	} else {
		shareBtn.textContent = `Your system doesn't support sharing these files.`;
		setTimeout(() => {
			shareBtn.textContent = 'Share Order!';
		}, '5000');
	}
};
///////////////////// CHECKOUT FUNCTIONALITY /////////////////////
// checkoutBtn.addEventListener('click', (e) => {
// 	let cartList = [];
// 	for (const key in invoiceObj) {
// 		let cartObj = {
// 			id: Number(invoiceObj[key].id),
// 			quantity: Number(invoiceObj[key].min),
// 		};
// 		cartList.push(cartObj);
// 	}
// 	if (cartList.length === 0) {
// 		/////////// ANIMATION WHITE ///////////
// 		e.currentTarget.classList.add('flashRed--2');
// 		checkoutBtn.addEventListener('animationend', () => {
// 			checkoutBtn.classList.remove('flashRed--2');
// 		});
// 		alert('The Cart Is Empty ☹️');
// 		return;
// 	}
// 	/////////// ANIMATION WHITE ///////////
// 	e.currentTarget.classList.add('flashWhite');
// 	checkoutBtn.addEventListener('animationend', () => {
// 		checkoutBtn.classList.remove('flashWhite');
// 	});

// 	/////////// FUNCTIONALITY ///////////
// 	fetch('/create-checkout-session', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify({
// 			items: cartList,
// 		}),
// 	})
// 		.then((res) => {
// 			if (res.ok) return res.json();
// 			return res.json().then((json) => Promises.reject(json));
// 		})
// 		.then(({ url }) => {
// 			window.location = url;
// 		})
// 		.catch((e) => {
// 			console.error(e.error);
// 		});
// });
