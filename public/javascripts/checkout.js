document.addEventListener('DOMContentLoaded',function(event) {
  Checkout.init();
});

var Checkout = (function() {

  /**
   * Lykill fyrir localstorage, geymum *allar* færslur undir þessum lykli í
   * fylki sem er breytt í JSON streng með JSON.stringify() og til baka í fylki
   * með JSON.parse()
   */
  var LOCALSTORAGE = 'webshop';

  function init() {
    let formButton = document.querySelector('.formButton');

    formButton.addEventListener('click', onFormButtonClick);
  }

  function onFormButtonClick(e) {
    e.preventDefault();

    let listOfDeliveryMethods = document.querySelector('.listOfDeliveryMethods');
    let notEmpty = listOfDeliveryMethods.hasChildNodes();

    if (notEmpty) {
      let nodes = listOfDeliveryMethods.childNodes;

      for (var i = nodes.length-1; i >= 0; i--) {
        listOfDeliveryMethods.removeChild(nodes[i]);
      }
    }

    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    listOfDeliveryMethods.appendChild(thead);
    listOfDeliveryMethods.appendChild(tbody);
    let headerRow = document.createElement('tr');
    thead.appendChild(headerRow);
    let th1 = document.createElement('th');
    let th2 = document.createElement('th');
    let th3 = document.createElement('th');
    th1.innerHTML = 'Nafn';
    th2.innerHTML = 'Lýsing';
    th3.innerHTML = 'Verð';
    headerRow.appendChild(th1);
    headerRow.appendChild(th2);
    headerRow.appendChild(th3);

    let ssnInput = document.querySelector('.kennitala');
    let postcodeValue = document.querySelector('.postnumer').value;

    let radios = document.getElementsByName('area');
    let area;
    if (radios[0].checked) {
      area = 'domestic';
    } else {
      area= 'Export';
    }

    let url = `http://test-ws.epost.is:8967/info/deliveryservices?mailClass=Parcel&areaClass=${area}&postcode=${postcodeValue}`;

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

      for (var i = 0; i < response.deliveryServices.length; i++) {
        let service = response.deliveryServices[i];

        let row = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        // let item = document.createTextNode(`${service.nameLong} - ${service.description}`);
        td1.innerHTML = `${service.nameLong}`;
        td2.innerHTML = `${service.description}`;
        row.classList.add('item');
        row.appendChild(td1);
        row.appendChild(td2);
        tbody.appendChild(row);
      }

    }).catch(function(error) {
      console.log(error);
    });
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
