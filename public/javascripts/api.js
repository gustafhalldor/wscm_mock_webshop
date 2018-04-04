document.addEventListener('DOMContentLoaded',function(event) {
  Api.init();
});


var Api = (function() {

  var LOCALSTORAGE_ALLOWED = 'apiKeyAllowed';
  var LOCALSTORAGE_NOT_ALLOWED = 'apiKeyNotAllowed';

  function init() {
    var generateKeyButton = document.querySelector('.generateKeyButton');
    generateKeyButton.addEventListener('click', handleGenerateKeyClick);

    var showKeyButton = document.querySelector('.showKeyButton');
    showKeyButton.addEventListener('click', handleShowKeyClick);
  }

  function handleGenerateKeyClick(e) {
    e.preventDefault();

    var showNewlyGenerated = document.querySelector('.showNewlyGenerated');

    if (showNewlyGenerated.hasChildNodes) {
      var children = showNewlyGenerated.childNodes;
      for (var i = 0; i < children.length; i++) {
        showNewlyGenerated.removeChild(children[i]);
      }
    }

    var url = 'http://localhost:8990/keyservice/create';

    var myInit = {
                'method': 'POST',
                'body': JSON.stringify({
                  'user': 6701695459,
                  'store': "0000000022"}
                }),
                'mode': 'cors',
                'cache': 'default'
              };

    let request = new Request(url, myInit)

    fetch(request)
      .then(function(res) {
        return res.json();
      }).then(function(json) {
        let pEl = document.createElement('p');
        pEl.classList.add('displayKey')
        pEl.innerHTML = json.key;
        showNewlyGenerated.appendChild(pEl);
      }).catch(function(e) {
        console.log(e);
      });
  }

  function handleShowKeyClick(e) {
    e.preventDefault();

    var showKeyFromDB = document.querySelector('.showKeyFromDB');

    if (showKeyFromDB.hasChildNodes) {
      var children = showKeyFromDB.childNodes;
      for (var i = 0; i < children.length; i++) {
        showKeyFromDB.removeChild(children[i]);
      }
    }

    var url = `http://localhost:8990/keyservice/get`;

    var myHeaders = new Headers({
      "x-user": "6701695459",
      "x-store": "0000000095"
    });

    var myInit = {
                'method': 'GET',
                'headers': myHeaders,
                'mode': 'cors',
                'cache': 'default'
              };

    let request = new Request(url, myInit);

    fetch(request)
      .then(function(res) {
        return res.text();
      }).then(function(data) {
        let pEl = document.createElement('p');
        pEl.classList.add('displayKey')
        if (data == "") {
          pEl.innerHTML = "No key found"
        } else {
          pEl.innerHTML = data;
        }
        showKeyFromDB.appendChild(pEl);
      }).catch(function(e) {
        console.log(e);
      });

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
