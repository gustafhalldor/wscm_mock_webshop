document.addEventListener('DOMContentLoaded',function(event) {
  Basket.init();
});

var Basket = (function() {

  /**
   * Lykill fyrir localstorage, geymum *allar* færslur undir þessum lykli í
   * fylki sem er breytt í JSON streng með JSON.stringify() og til baka í fylki
   * með JSON.parse()
   */
  var LOCALSTORAGE = 'webshop';

  function init() {
    let data = load(LOCALSTORAGE);
    let list = document.querySelector('.list');

    let emptyBasket = document.createTextNode('Karfan er tóm :(');
    if (data != null) {
      showItems(data, list);
    } else if (data == null){
      list.appendChild(emptyBasket);
    }

    let backOrEmpty = document.querySelector('.backOrEmpty');

    let checkoutButton = document.querySelector('.checkout');
    checkoutButton.addEventListener('click', function() {
      handleCheckoutClick(data);
    });

    createBackButton(backOrEmpty);
    createClearBasketButton(backOrEmpty);
  }

  function handleCheckoutClick(data) {
    const url = `http://localhost:1337/checkout`;

    const myHeaders = new Headers();
    myHeaders.set('Content-Type', 'application/json');

    const init = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: myHeaders,
    };

    const request = new Request(url, init);

    fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response);
        window.location.replace(response.redirectTo)
      })
      .catch((error) => {
        console.log('Tókst ekki að vista email viðskiptavinar.', error);
      });
  }

  function createClearBasketButton(backOrEmpty) {
    let clearBasket = document.createElement('a');
    clearBasket.classList.add('btn', 'btn-info', 'pull-right', 'padding12px');

    const text = document.createTextNode('TÆMA KÖRFU');
    clearBasket.setAttribute('href', "/basket");
    clearBasket.appendChild(text);

    var container = document.querySelector('.container');
    backOrEmpty.appendChild(clearBasket);

    clearBasket.addEventListener('click', function() {
      save(LOCALSTORAGE, null);
    })
  }

  function createBackButton(backOrEmpty) {
    let backButton = document.createElement('a');
    backButton.classList.add('btn', 'btn-info', 'pull-right', 'padding12px');

    const text = document.createTextNode('TIL BAKA');
    backButton.setAttribute('href', "/");
    backButton.appendChild(text);

    var container = document.querySelector('.container');
    backOrEmpty.appendChild(backButton);
  }

  function showItems(data, list) {
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let headerRow = document.createElement('tr');
    let th1 = document.createElement('th');
    let th2 = document.createElement('th');
    let th3 = document.createElement('th');
    th1.innerHTML = 'Heiti';
    th2.innerHTML = 'Fjöldi';
    th3.innerHTML = 'Verð';
    headerRow.appendChild(th1);
    headerRow.appendChild(th2);
    headerRow.appendChild(th3);
    thead.appendChild(headerRow);
    list.appendChild(thead);
    list.appendChild(tbody);

    let totalPrice = 0;
    for (var i = 0; i < data.length; i++) {
      let item = data[i];
      if (item.count > 0) {
        let bodyRow = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');

        td1.innerHTML = item.name;
        td2.innerHTML = item.count;
        td3.innerHTML = item.price*item.count;
        totalPrice += item.price*item.count;

        bodyRow.appendChild(td1);
        bodyRow.appendChild(td2);
        bodyRow.appendChild(td3);

        tbody.appendChild(bodyRow);
      }
    }

    let total = document.createElement('p');
    total.classList.add('samtals');


    let totaltext = document.createTextNode(`Samtals: ${totalPrice} kr.`)
    total.appendChild(totaltext);

    let listGaur = document.querySelector('.listGaur');
    listGaur.appendChild(total);
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
