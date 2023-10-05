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


function displayBalances() {

    document.getElementById("largeHomeBalanceValue").innerHTML = "£ " + totalBalance;

    document.getElementById("BTCBalance").innerHTML = "BTC " + BTCBalance;

    document.getElementById("BBKBalance").innerHTML = "BBK " + BBKBalance;

    document.getElementById("HLFBalance").innerHTML = "HLF " + HLFBalance;

    document.getElementById("DOGEBalance").innerHTML = "DOGE " + DOGEBalance;
}

//toggles popup for public key
function togglePopup() {
  
  var popup = document.getElementById("publicKeyPopup");
  popup.innerHTML = "Your public key is:";
  popup.classList.toggle("show");
}

function toggleBalance() {
  var largeBalance = document.getElementById("largeHomeBalance");
  document.getElementById("largeHomeBalance").style.transition = "all 0.3s";

  if (largeBalance.classList.contains('largeTotalBalance')) {
    document.getElementById("largeHomeBalanceTitle").innerHTML = "GBP Balance:";
    document.getElementById("largeHomeBalanceValue").innerHTML = "£" + GBPBalance;
    largeBalance.classList.remove("largeTotalBalance");
    largeBalance.classList.add("largeGBPBalance");
  } else {
    document.getElementById("largeHomeBalanceTitle").innerHTML = "Total Balance:";
    document.getElementById("largeHomeBalanceValue").innerHTML = "£" + totalBalance;
    largeBalance.classList.add("largeTotalBalance");
    largeBalance.classList.remove("largeGBPBalance");
  }

}


//displays modal for each function 
function displayModal(button) {
    document.getElementById(button + "Modal").style.display = "block";
}


//hides the modal and resets form
function hideModal(button) {

  if(button == 'buy' ||  button ==  'sell') {
  document.getElementById(button + "Form").reset();
  document.getElementById(button + "Rate").innerHTML = ""; }
    document.getElementById(button + "Modal").style.display = "none";
}


//displays rate in buy and sell modal
function displayRate(functionModal) {
    
  var currency = document.querySelector("#" + functionModal + "Currency").value;

  GBPRate = getGBPRate(currency);

  
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


function getGBPRate(currency) {
  switch(currency){

    case "BTC": 
      rate = BTCRate;
      return rate;
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

function updateConversion() {
  var startCurrencyInput = document.getElementById("buyStartCurrency");
  var endCurrencyInput = document.getElementById("buyEndCurrency");
  var selectedCurrency = document.getElementById("buyCurrency").value;

  if (startCurrencyInput === document.activeElement) {
      // If "buyStartCurrency" input is focused, update "buyEndCurrency"
      var startCurrencyValue = parseFloat(startCurrencyInput.value);
      var rate = getGBPRate(selectedCurrency);
      var convertedValue = startCurrencyValue * rate;

      if (!isNaN(convertedValue)) {
          endCurrencyInput.value = convertedValue.toFixed(6); // Limit decimal places if needed
      } else {
          endCurrencyInput.value = "";
      }
  } else {
      // If "buyEndCurrency" input is focused, update "buyStartCurrency"
      var endCurrencyValue = parseFloat(endCurrencyInput.value);
      var inverseRate = 1 / getGBPRate(selectedCurrency);
      var convertedValue = endCurrencyValue * inverseRate;

      if (!isNaN(convertedValue)) {
          startCurrencyInput.value = convertedValue.toFixed(6); // Limit decimal places if needed
      } else {
          startCurrencyInput.value = "";
      }
  }
}

// Add event listeners to the input fields
document.getElementById("buyStartCurrency").addEventListener("input", updateConversion);
document.getElementById("buyCurrency").addEventListener("change", updateConversion);
document.getElementById("buyEndCurrency").addEventListener("input", updateConversion);


function buyCrypto() {

  var startCurrencyInput = document.getElementById("buyStartCurrency").value;
  var endCurrencyInput = document.getElementById("buyEndCurrency").value;
  var selectedCurrency = document.getElementById("buyCurrency").value;

  if(confirm(`Are you sure you want to buy ${endCurrencyInput} ${selectedCurrency} with £${startCurrencyInput}?`)) {
      GBPBalance = GBPBalance - startCurrencyInput;
     
      hideModal('buy');
      return GBPBalance; 
  }


}







  
  function getAllSpecialists() {
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
        var specialist = response[i];
        document.getElementById("allSpecialists").innerHTML += (
          "<p>" + specialist.id + " " + specialist.first_name + " " + specialist.last_name + "</p>"
        );
      }
    })
    .catch(error => {
      console.error('There was an error', error);
    })
  }
  
  // getAllSpecialists();
  
  function selectSpecialist() {
    // Get the selected values from the form
    var supportArea = document.querySelector('input[name="supportArea"]:checked').value;
    var region = document.querySelector('#region').value;
  
    if((supportArea != "") && (region != "" )) {
  
    
    var hubAddress;
    var hubPhoneNumber;
    var specialistName;
  
    fetch('http://localhost:8080/test/' + supportArea + '/' + region)
    .then(response => {
      if (!response.ok) {
        return response.status;
      } else {
        return response.json();
      }
    })
    .then(response => {
      if (typeof response === 'object') {
        // Check if the response is a valid JSON object
        console.log(response); // Print the response to the console
        
        document.getElementById('specialistName').innerHTML = response.specialistDTO.first_name + ' '  + response.specialistDTO.last_name;
        document.getElementById('specialistCallBack').innerHTML = response.specialistDTO.first_name;
  
        document.getElementById('hubAddress').innerHTML = response.hubDTO.address;
        document.getElementById('hubPhoneNumber').innerHTML = '0' + response.hubDTO.phone_number;
      } else {
        console.error('Invalid JSON response:', response);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
  } else {
    window.alert('Test');
      document.getElementById('invalidInput').style.display = 'flex';
  }
  
  
  }

  displayBalances();