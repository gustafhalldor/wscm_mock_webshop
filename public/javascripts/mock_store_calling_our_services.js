document.addEventListener('DOMContentLoaded',function(event) {
  Webshop.init();
});

var Webshop = (function() {

  /**
   * Lykill fyrir localstorage, geymum *allar* færslur undir þessum lykli í
   * fylki sem er breytt í JSON streng með JSON.stringify() og til baka í fylki
   * með JSON.parse()
   */
  var LOCALSTORAGE = 'webshop';

  function init() {
    let getWebshopSettingsButton = document.querySelector('.getSettingsButton');
    let getDeliveryServicesButton = document.querySelector('.getDeliveryServicesButton');
    let getTotalPriceButton = document.querySelector('.getTotalPriceButton');

    getWebshopSettingsButton.addEventListener('click', onGetWebshopSettingsButtonClick);
    getDeliveryServicesButton.addEventListener('click', onGetDeliveryServicesButtonClick);
    getTotalPriceButton.addEventListener('click', onGetTotalPriceButtonClick);
  }

  function onGetWebshopSettingsButtonClick(e) {
    e.preventDefault();

    let displaySettings = document.querySelector('.birtaStillingar');

    let url = `http://test-ws.epost.is:8989/wscm/webshop`;

    var myHeaders = new Headers({
      "x-api-key": "4F/UEh52hA86NWTQyM6+ogYGEsOClgD19jfrwl4Ol2E="
    });

    var myInit = {
                'method': 'GET',
                'headers': myHeaders,
                'mode': 'cors',
                'cache': 'default'
              };

    let request = new Request(url, myInit);

    fetch(request)
    .then(response => {
      return response.json();
    }).then(function(response) {
      displaySettings.innerHTML = JSON.stringify(response);
    }).catch(function(error) {
      console.log(error);
    });
  }

  function onGetDeliveryServicesButtonClick(e) {
    e.preventDefault();

    let showDeliveryMethodsAndPrices = document.querySelector('.birtaAfhendingarleidir');

    let url = `http://test-ws.epost.is:8967/info/deliveryprices?Language=is&countryCode=IS&postCode=101&weight=2&length=10&width=10&height=10`;

    var myHeaders = new Headers({
      "x-api-key": "4F/UEh52hA86NWTQyM6+ogYGEsOClgD19jfrwl4Ol2E="
    });

    var myInit = {
                'method': 'GET',
                'headers': myHeaders,
                'mode': 'cors',
                'cache': 'default'
              };

    let request = new Request(url, myInit);

    fetch(request)
    .then(response => {
      return response.json();
    }).then(function(response) {
      console.log(response);
      for (let i in response.deliveryPrices) {
        let div = document.createElement('div');
        let span = document.createElement('span');
        span.innerHTML = response.deliveryPrices[i].nameLong;
        span.append(" - "+response.deliveryPrices[i].deliveryServiceId+" - "+response.deliveryPrices[i].priceRelated.bruttoPrice + " kr.")
        div.appendChild(span);
        showDeliveryMethodsAndPrices.appendChild(div);
      }


    }).catch(function(error) {
      console.log(error);
    });
  }

  function onGetTotalPriceButtonClick(e) {
    e.preventDefault();

    let showTotalPrice = document.querySelector('.birtaSamtalsVerd');

    let div1 = document.createElement('div');
    let div2 = document.createElement('div');
    let div3 = document.createElement('div');

    let span1 = document.createElement('span');
    let span2 = document.createElement('span');
    let span3 = document.createElement('span');

    span1.innerHTML = "Vöruverð - xxx kr.";
    span2.innerHTML = "Pakki heim - yyy kr.";
    span3.innerHTML = "SAMTALS - ZZZZ kr.";

    div1.appendChild(span1);
    div2.appendChild(span2);
    div3.appendChild(span3);

    showTotalPrice.appendChild(div1);
    showTotalPrice.appendChild(div2);
    showTotalPrice.appendChild(div3);
  }
  /**
   * @param {string} key Lykill sem við notum í localStorage
   * @param {array} Fylki af stöffi til að vista
   */
  function save(key, items) {
    let jsonValue = JSON.stringify(items);

    window.localStorage.setItem(key, jsonValue);
  }

  /**
   * Sækir stöff úr localStorage og skilar í fylki
   *
   * @param {string} key Lykill sem við notum í localStorage
   *
   * @return {array} Fylki af stöffi í localStorage
   * @return {null} Ef ekkert er til staðar í localStorage
   */
  function load(key) {
    let data = window.localStorage.getItem(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  return {
    init: init
  };
})();
