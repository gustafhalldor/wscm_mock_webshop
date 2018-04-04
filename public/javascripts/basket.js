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

    // let checkoutButton = document.querySelector('.checkout');
    // checkoutButton.addEventListener('click', function() {
    //   handleCheckoutClick();
    // });

    createBackButton(backOrEmpty);
    createClearBasketButton(backOrEmpty);
    // fillCountryList();
  }

  // function handleCheckoutClick() {
  //   console.log("smellti á takka");
  //   window.location.href = "http://stackoverflow.com";
  // }

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

    for (var i = 0; i < data.length; i++) {
      let item = data[i];
      if (item.count > 0) {
        let bodyRow = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');

        td1.innerHTML = item.name;
        td2.innerHTML = item.count;
        td3.innerHTML = item.price;

        bodyRow.appendChild(td1);
        bodyRow.appendChild(td2);
        bodyRow.appendChild(td3);

        tbody.appendChild(bodyRow);
      }
    }

    let total = document.createElement('p');
    total.classList.add('samtals');
    let totaltext = document.createTextNode(`Samtals: ${data[0].price + data[1].price + data[2].price} kr.`)
    total.appendChild(totaltext);

    let listGaur = document.querySelector('.listGaur');
    listGaur.appendChild(total);
  }

  // function fillCountryList() {
  //   let countrylist = document.querySelector('.countrySelection');
  //   let ice =document.createElement('option');
  //   ice.setAttribute('label', 'Ísland');
  //   ice.setAttribute('value', 'IS');
  //   countrylist.appendChild(ice);
  //
  //   let url = `http://test-ws.epost.is:8989/wscm/countries?language=en`;
  //
  //   var myHeaders = new Headers({
  //     "x-api-key": "4F/UEh52hA86NWTQyM6+ogYGEsOClgD19jfrwl4Ol2E="
  //   });
  //
  //   var myInit = {
  //               'method': 'GET',
  //               'headers': myHeaders,
  //               'mode': 'cors',
  //               'cache': 'default'
  //             };
  //
  //   let request = new Request(url, myInit);
  //
  //   fetch(request)
  //     .then(function(res) {
  //       return res.json();
  //     }).then(function(data) {
  //       for (var i = 0; i < data.countries.length; i++) {
  //         if (data.countries[i].countryCode === 'IS') {
  //           continue;
  //         }
  //         let item = data.countries[i];
  //
  //         let option = document.createElement('option');
  //         option.setAttribute('label', item.nameShort);
  //         option.setAttribute('value', item.countryCode);
  //         countrylist.appendChild(option);
  //       }
  //     });
  // }

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
