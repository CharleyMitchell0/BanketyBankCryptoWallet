var totalBalance = 120000;

var BTCBalance = 0.0001;

var BBKBalance = 0.00089;

var HLFBalance = 786.834;

var DOGEBalance = 3685;

var GBPBalance = 264.83;


var BTCRate = 0.000044292969557;

var BBKRate = 0.00334234624;

var HLFRate  = 10.09832679798;

var DOGERate = 19.90261913532077;


var currentAccountBalance = 560.34;

var savingsAccountBalance = 1231245.98;

let currencyRates = {};

let currencyBalances = {};


var publicKey;

function displayBalances() {

  totalBalance = calculateBalanceTotal();

    document.getElementById("largeHomeBalanceValue").innerHTML = "£" + totalBalance.toFixed(2);

    document.getElementById("BTCBalance").innerHTML = "BTC " + currencyBalances['BTC'];

    document.getElementById("BBKBalance").innerHTML = "BBK " + currencyBalances['BBK'];

    document.getElementById("HLFBalance").innerHTML = "HLF " + currencyBalances['HLF'];

    document.getElementById("DOGEBalance").innerHTML = "DOGE " + currencyBalances['DOGE'];

    document.getElementById("buyGBPBalance").innerHTML = "£" + currencyBalances['GBP'];

    document.getElementById("sellCryptoBalance").innerHTML = "BTC " + currencyBalances['BTC'];

    document.getElementById("addCashGBPBalance").innerHTML = "£" + currencyBalances['GBP'];

    document.getElementById("cashOutGBPBalance").innerHTML = "£" + currencyBalances['GBP'];
}

//toggles popup for public key
function togglePopup() {
  
  var popup = document.getElementById("publicKeyPopup");
  popup.innerHTML = "Copied!";
  popup.classList.toggle("show");
}

//changes between total & GBP balance
function toggleBalance() {

  //selects the homepage balance
  var largeBalance = document.getElementById("largeHomeBalance");
  document.getElementById("largeHomeBalance").style.transition = "all 0.3s";

  //if set to total balance then change to GBP
  if (largeBalance.classList.contains('largeTotalBalance')) {

    document.getElementById("largeHomeBalanceTitle").innerHTML = "GBP Balance:";
    document.getElementById("largeHomeBalanceValue").innerHTML = "£" + currencyBalances['GBP'].toFixed(2);
    largeBalance.classList.remove("largeTotalBalance");
    largeBalance.classList.add("largeGBPBalance");

    //if set to GBP then change to total
  } else {

    document.getElementById("largeHomeBalanceTitle").innerHTML = "Total Balance:";
    document.getElementById("largeHomeBalanceValue").innerHTML = "£" + totalBalance.toFixed(2);
    largeBalance.classList.add("largeTotalBalance");
    largeBalance.classList.remove("largeGBPBalance");

  }
}


function calculateBalanceTotal() {

  // const currencies = ['BTC', 'BBK', 'HLF', 'DOGE', 'GBP'];

  // let i = 0;

  // for (let i = 0; i < currencies.length; i++) {

  // }
  
  total = convertToGBP('BTC') + convertToGBP('BBK') + convertToGBP('HLF') + convertToGBP('DOGE') + convertToGBP('GBP');

  return total;

}



//on change of sell select box, also uses display rate and get sell balance 
function sellCryptoBalance() {

  displayRate('sell');

  var currency = document.querySelector('#sellCurrency').value;

  // getSellBalance(currency);

  document.getElementById("sellCryptoBalanceTitle").innerHTML = `Your ${currency} Balance:`;
  document.getElementById("sellCryptoBalance").innerHTML = currencyBalances[currency].toFixed(8);

}



//displays modal for each function 
function displayModal(button) {
    document.getElementById(button + "Modal").style.display = "block";
}


//hides the modal and resets forms
function hideModal(button) {

  if(button == 'buy' ||  button ==  'sell') {
  document.getElementById(button + "Rate").innerHTML = ""; 

} else if (button == 'addCash') {

  document.getElementById(button + "AccountBalance").innerHTML ="";

}

  document.getElementById(button + "Form").reset();
    document.getElementById(button + "Modal").style.display = "none";
    refreshInfo();
}


//displays rate in buy and sell modal
function displayRate(functionModal) {
    
  var currency = document.querySelector("#" + functionModal + "Currency").value;

  // GBPRate = getGBPRate(currency);

  GBPRate = currencyRates[currency];
  
  switch(functionModal) {

    case "buy": 
      document.getElementById(functionModal + "Rate").innerHTML = `1 GBP =  ${GBPRate.toFixed(8)} ${currency}`;
      break;

    case "sell":
      var currencyRate = 1 / GBPRate;
      document.getElementById(functionModal + "Rate").innerHTML = `1 ${currency} =  ${currencyRate.toFixed(2)} GBP`;
      break;
  }
  }

  function displayAccountBalance() {
    var account = document.querySelector("#addCashAccount").value;

    switch(account) {

      case "currentAccount": 
        var balance = currentAccountBalance;
        break;

      case "savingsAccount":
        var balance = savingsAccountBalance;
        break;
    }

    document.getElementById("addCashAccountBalance").innerHTML = "Balance = £" + balance;
  }



  function updateConversion() {
    var startCurrencyInput = document.getElementById("buyStartCurrency");
    var endCurrencyInput = document.getElementById("buyEndCurrency");
    var selectedCurrency = document.getElementById("buyCurrency").value;
  
    var startCurrencyValue = parseFloat(startCurrencyInput.value);
    var endCurrencyValue = parseFloat(endCurrencyInput.value);
  
    // Update "buyEndCurrency" based on "buyCurrency" select change
    if (document.activeElement === document.getElementById("buyCurrency")) {
      var rate = currencyRates[selectedCurrency];
      var convertedValue = startCurrencyValue * rate;
  
      if (!isNaN(convertedValue)) {
        endCurrencyInput.value = convertedValue.toFixed(6);
      } else {
        endCurrencyInput.value = "";
      }
    }
  
    // Update "buyStartCurrency" when "buyEndCurrency" is changed
    if (document.activeElement === endCurrencyInput) {
      var inverseRate = 1 / currencyRates[selectedCurrency];
      var convertedValue = endCurrencyValue * inverseRate;
  
      if (!isNaN(convertedValue)) {
        startCurrencyInput.value = convertedValue.toFixed(6);
      } else {
        startCurrencyInput.value = "";
      }
    }
  
    // Update "buyEndCurrency" when "buyStartCurrency" is changed
    if (document.activeElement === startCurrencyInput) {
      var rate = currencyRates[selectedCurrency];
      var convertedValue = startCurrencyValue * rate;
  
      if (!isNaN(convertedValue)) {
        endCurrencyInput.value = convertedValue.toFixed(6);
      } else {
        endCurrencyInput.value = "";
      }
    }
  }
  
  // Added event listeners to the input fields and the currency dropdown
  document.getElementById("buyStartCurrency").addEventListener("input", updateConversion);
  document.getElementById("buyCurrency").addEventListener("change", updateConversion);
  document.getElementById("buyEndCurrency").addEventListener("input", updateConversion);

  function updateSellConversion() {
    var sellStartCurrencyInput = document.getElementById("sellStartCurrency");
    var sellEndCurrencyInput = document.getElementById("sellEndCurrency");
    var selectedCurrency = document.getElementById("sellCurrency").value;
  
    var sellStartCurrencyValue = parseFloat(sellStartCurrencyInput.value);
    var sellEndCurrencyValue = parseFloat(sellEndCurrencyInput.value);
  
    // Update "sellEndCurrency" when "sellCurrency" is changed
    if (document.activeElement === selectedCurrency) {
      var inverseRate = 1 / currencyRates[selectedCurrency];
      var convertedValue = sellStartCurrencyValue * inverseRate;
  
      if (!isNaN(convertedValue)) {
        sellEndCurrencyInput.value = convertedValue.toFixed(6);
      } else {
        sellEndCurrencyInput.value = "";
      }
    }
  
    // Update "sellStartCurrency" when "sellEndCurrency" is changed
    if (document.activeElement === sellEndCurrencyInput) {
      var rate = currencyRates[selectedCurrency];
      var convertedValue = sellEndCurrencyValue * rate;
  
      if (!isNaN(convertedValue)) {
        sellStartCurrencyInput.value = convertedValue.toFixed(6);
      } else {
        sellStartCurrencyInput.value = "";
      }
    }

    // Update "sellEndCurrency" when "sellStartCurrency" is changed
    if (document.activeElement === sellStartCurrencyInput) {
      var inverseRate = 1 / currencyRates[selectedCurrency];
      var convertedValue = sellStartCurrencyValue * inverseRate;
  
      if (!isNaN(convertedValue)) {
        sellEndCurrencyInput.value = convertedValue.toFixed(6);
      } else {
        sellEndCurrencyInput.value = "";
      }
  }
}
  
  // Add event listeners to the input fields and the currency dropdown
  document.getElementById("sellStartCurrency").addEventListener("input", updateSellConversion);
  document.getElementById("sellCurrency").addEventListener("change", updateSellConversion);
  document.getElementById("sellEndCurrency").addEventListener("input", updateSellConversion);

function buyCrypto() {

  var startCurrencyInput = document.getElementById("buyStartCurrency").value;
  var endCurrencyInput = document.getElementById("buyEndCurrency").value;
  var selectedCurrency = document.getElementById("buyCurrency").value;

  if(confirm(`Are you sure you want to buy ${endCurrencyInput} ${selectedCurrency} with £${startCurrencyInput}?`)) {
      GBPBalance = GBPBalance - startCurrencyInput;

      var newGBPBalance = currencyBalances['GBP'] - parseFloat(startCurrencyInput);

      updateBalance('GBP', newGBPBalance);

      var newBalance = parseFloat(endCurrencyInput) + currencyBalances[selectedCurrency];
     updateBalance(selectedCurrency, newBalance);
      
     
      hideModal('buy');
  }

}

// converts the currency to a GBP value
function convertToGBP(currency) {

  let GBPValue = currencyBalances[currency] * currencyRates[currency];

  return GBPValue;
}

function changeCryptoBalance(currency, endCurrencyInput) {
  switch(currency){

        case "BTC": 
          BTCBalance = BTCBalance + endCurrencyInput;
          break;
    
        case "BBK": 
          rate = BBKRate;
          return rate;
          break;
    
          case "HLF": 
          rate = HLFRate;
          return rate;
          break;
    
          case "DOGE": 
          rate = DOGERate;
          return rate;
          break;
      } 
}

function getRates() {

  fetch('http://localhost:8080/all')
  .then(response => {
    if (!response.ok) {
      return response.status;
    } else {
      return response.json();
    }
  })
  .then (response => {
    var num = response.length;

    for(var i = 0; i < num; i ++) {
      var currency = response[i];
      document.getElementById("testAllCryptos").innerHTML += (
        "<p>" + currency.currencyID + " " + currency.currencyName + " " + currency.exchangeRate1GBP + "</p>"
      );

    }
    
  })
  .catch(error => {
    console.error('There was an error', error);
  })

}

function getCurrencyInfo(currency, callback) {

  //gets info from database 

  fetch('http://localhost:8080/combined?CurrencyID=' + currency)
  .then(response => {
    if (!response.ok) {
      return response.status;
    } else {
      return response.json();
    }
  })
  .then (response => {

    //assigns the rate to the relevant currencyID in the object
   currencyRates[currency] = response.currencyDTO.exchangeRate1GBP;


   //Below is a test to show the database info on the homepage
      // document.getElementById("testAllCryptos").innerHTML += (
      //   "<p>" + response.currencyDTO.currencyID + " " + response.currencyDTO.currencyName + " " + currencyRates[currency] + "</p>")
    
     currencyBalances[currency] = response.balanceDTO.currencyBalance;   
    
    callback();
  })
  .catch(error => {
    console.error('There was an error', error);
  })
}

refreshInfo();
// getRates();


function refreshInfo() {

  let count = 0;

  const currencies = ['BTC', 'BBK', 'HLF', 'DOGE', 'GBP'];

  function handleCallback() {
    count++;
    if (count === currencies.length) {
        displayBalances();
    }
}

// Retrieve data for each currency with a callback
currencies.forEach(currency => {
    getCurrencyInfo(currency, handleCallback);
});
}


function updateBalance(currency, amount) {
  fetch('http://localhost:8080/updateBalance', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currency, amount }), 
  })
      .then(response => {
          if (response.status === 200) {
              // Handle success
              refreshInfo();
          } else {
              // Handle error
          }
      })
      .catch(error => {
          // Handle network error
      });
}


