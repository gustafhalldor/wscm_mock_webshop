document.addEventListener('DOMContentLoaded',function(event) {
  Webshop.init();
});


var Webshop = (function() {

  var LOCALSTORAGE = 'webshop';

  let speakerCount;
  let grillCount;
  let walkieCount;
  let basket = document.createElement('a');

  function init() {

    let data = load(LOCALSTORAGE);

    if (data == null) {
      speakerCount = 0;
      grillCount = 0;
      walkieCount = 0;
    } else {
      speakerCount = data[0].count;
      grillCount = data[1].count;
      walkieCount = data[2].count;
    }

    let sum = 0;
    data = load(LOCALSTORAGE);
    if (data) {
      sum = data[0].count + data[1].count + data[2].count;
    }

    createBasket(basket, sum);
    addEventListeners(sum);
  }

  function createBasket(basket, sum) {
    //let basket = document.createElement('a');
    basket.classList.add('btn', 'btn-info', 'pull-right', 'padding12px', 'basketButton');

    const text = document.createTextNode(`KARFA ${sum} hlutir`);
    basket.setAttribute('href', "/basket");
    basket.appendChild(text);

    var container = document.querySelector('.container');
    container.prepend(basket);
  }

  function addEventListeners(sum) {
    let speakerButton = document.querySelector('.speakerButton');
    let grillButton = document.querySelector('.grillButton');
    let walkieButton = document.querySelector('.walkieButton');
    let basketButton = document.querySelector('.basketButton');

    speakerButton.addEventListener('click', function() {
      speakerCount++;
      displayNewCount(++sum);
    })

    grillButton.addEventListener('click', function() {
      grillCount++;
      displayNewCount(++sum, basketButton);
    })

    walkieButton.addEventListener('click', function() {
      walkieCount++;
      displayNewCount(++sum, basketButton);
    })

    basketButton.addEventListener('click', handleBasketClick);
  }

  function displayNewCount(sum, basketButton) {
    basket.removeChild(basket.firstChild);
    const text = document.createTextNode(`KARFA ${sum} hlutir`);
  //  basket.setAttribute('href', "/basket");
    basket.appendChild(text);
  }

  function handleBasketClick(event) {

    let speakers = {
      'name': 'Hátalari',
      'count': speakerCount,
      'price': speakerCount*5000
    }

    let grills = {
      'name': 'Grill',
      'count': grillCount,
      'price': grillCount*5000
    }

    let walkies = {
      'name': 'Talstöð(x2)',
      'count': walkieCount,
      'price': walkieCount*5000
    }

    let array;
    if (speakers.count == 0 && grills.count == 0 && walkies.count == 0) {
      array = null;
    } else {
      array = [speakers, grills, walkies];
    }

    save(LOCALSTORAGE, array);
  }

  /**
   * @param {string} key Lykill sem við notum í localStorage
   * @param {array} items Fylki af stöffi til að vista
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
