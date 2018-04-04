document.addEventListener('DOMContentLoaded',function(event) {
  MockUI.init();
});

var MockUI = (function() {

  var LOCALSTORAGE = 'webshop';
  let test_SA = 'test-ws.epost.is:8966';
  let local_SA = 'localhost:8966';

  let sa_environment = test_SA;
  let store = '0000000095';

  let token = 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJiNjAyNTQ3My0wN2MzLTRkYjQtYTNkZi0wZWU0MGE1Mjk4MWIiLCJzdWIiOiIyODhiOGYxZC1jZjkxLTQ1ODYtOGZlZC1hNTU0ZmNkZWQ3NmEiLCJzY29wZSI6WyJtYXBwYW4ubm90YW5kaSIsIm1hcHBhbi5wYXNzd29yZCJdLCJjbGllbnRfaWQiOiJtYXBwYW4tcGFzc3dvcmQiLCJjaWQiOiJtYXBwYW4tcGFzc3dvcmQiLCJncmFudF90eXBlIjoicGFzc3dvcmQiLCJ1c2VyX2lkIjoiMjg4YjhmMWQtY2Y5MS00NTg2LThmZWQtYTU1NGZjZGVkNzZhIiwidXNlcl9uYW1lIjoiNjcwMTY5NTQ1OSIsImVtYWlsIjoidmVzdGVpbm52QHBvc3R1ci5pcyIsImlhdCI6MTUxMTQ0MzI0NywiZXhwIjoxNTExNDcyMDQ3LCJpc3MiOiJodHRwczovL2FwaXRlc3QubWFwcGFuLmlzL2F1dGgvb2F1dGgvdG9rZW4iLCJhdWQiOlsibWFwcGFuIl19.hD9OpYsF5_SkPinEoK3nVq_V3if8QrEG5L191b1jqbV7gACKW8ri9unsNYOHp8jwqeNKAlIOhsF9wJGyzqyNH0vaIslbaQSVyb40gBlNePupDOqA1j5EgXm3yPxs2aE5Hd3v2lNjqddzOEFGWL-ep1ibJjrmT94iJTc5wjRp3ooG6nRv5udVtcW0xAy-z0WvTtV-5e6lceK83klXA_ySUkSetVA1YV8dKoOfQnrSuCzXBOV6BXIl0P0ll0fTBIPJUfs96mPGizpD8QtyRBfhjdG2MFqYkHF1qyMgt_f9OgEDjVb_Rp6wYiNmb3q-YbBT1UvkgVbukbeh2VtWc-plZA';

  function init() {
    let getWebshopsButton = document.querySelector('.getWebshopsButton');
    let getWebshopSettingsButton = document.querySelector('.getWebshopSettingsButton');
    let saveButton = document.querySelector('.saveButton');
    let generateKeyButton = document.querySelector('.generateKeyButton');
    let showKeyButton = document.querySelector('.showKeyButton');

    getWebshopsButton.addEventListener('click', onGetWebshopsButtonClick);
    getWebshopSettingsButton.addEventListener('click', onGetWebshopSettingsButtonClick);
    saveButton.addEventListener('click', onSaveButtonClick);
    generateKeyButton.addEventListener('click', handleGenerateKeyClick);
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

    var url = `http://${sa_environment}/sa/webshops/${store}/apikey`;

    var myHeaders = new Headers({
      "Authorization": token
    });

    var myInit = {
                'method': 'POST',
                'headers': myHeaders,
                'mode': 'cors',
                'cache': 'default'
              };

    let request = new Request(url, myInit)

    fetch(request)
      .then(function(res) {
        if (res.status == 201) {
          let show = document.querySelector('.showNewlyGenerated');
          let p = document.createElement('p');
          p.textContent = 'New API key created';

          show.appendChild(p);
        } else {
          console.log("eitthvað ves!");
          console.log(res);
        }
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

    var url = `http://${sa_environment}/sa/webshops/${store}/apikey`;

    var myHeaders = new Headers({
      "Authorization": token
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

  function onSaveButtonClick(e) {
    e.preventDefault();

    // Svo ég sé ekki að save-a engar stillingar
    let deliveryMethod0Name = document.querySelector('.deliveryMethod0Header').textContent;
    if (deliveryMethod0Name == "") {
      return;
    }

    // let isActive = document.querySelector('.isActive').checked;
    // let useDefaultDeliverySettings =document.querySelector('.defaultDeliveryMethods').checked;

    let deliveryMethod1Name = document.querySelector('.deliveryMethod1Header').textContent;
    let deliveryMethod2Name = document.querySelector('.deliveryMethod2Header').textContent;
    let deliveryMethod3Name = document.querySelector('.deliveryMethod3Header').textContent;
    let deliveryMethod4Name = document.querySelector('.deliveryMethod4Header').textContent;

    let deliveryMethod0UseDefaultPrice = document.querySelector('.deliveryMethod0UseDefaultPrice').checked;
    let deliveryMethod0CustomPrice = document.querySelector('.deliveryMethod0CustomPrice').value;
    let deliveryMethod0Enabled = document.querySelector('.deliveryMethod0Enabled').checked;

    let deliveryMethod1UseDefaultPrice = document.querySelector('.deliveryMethod1UseDefaultPrice').checked;
    let deliveryMethod1CustomPrice = document.querySelector('.deliveryMethod1CustomPrice').value;
    let deliveryMethod1Enabled = document.querySelector('.deliveryMethod1Enabled').checked;

    let deliveryMethod2UseDefaultPrice = document.querySelector('.deliveryMethod2UseDefaultPrice').checked;
    let deliveryMethod2CustomPrice = document.querySelector('.deliveryMethod2CustomPrice').value;
    let deliveryMethod2Enabled = document.querySelector('.deliveryMethod2Enabled').checked;

    let deliveryMethod3UseDefaultPrice = document.querySelector('.deliveryMethod3UseDefaultPrice').checked;
    let deliveryMethod3CustomPrice = document.querySelector('.deliveryMethod3CustomPrice').value;
    let deliveryMethod3Enabled = document.querySelector('.deliveryMethod3Enabled').checked;

    let deliveryMethod4UseDefaultPrice = document.querySelector('.deliveryMethod4UseDefaultPrice').checked;
    let deliveryMethod4CustomPrice = document.querySelector('.deliveryMethod4CustomPrice').value;
    let deliveryMethod4Enabled = document.querySelector('.deliveryMethod4Enabled').checked;

    let url = `http://${sa_environment}/sa/webshopsettings?storeId=${store}`;

    var myHeaders = new Headers({
      "Authorization": token,
      'Content-Type': 'application/json',
    });

    for (var i = 0; i < 5; i++) {
      if (deliveryMethod0Name == "Póstbox") {
        deliveryMethod0Name = 'postbox';
        continue;
      }
      if (deliveryMethod0Name == "Heimkeyrsla") {
        deliveryMethod0Name = 'homeDelivery';
        continue;
      }
      if (deliveryMethod0Name == "Afhent í verslun") {
        deliveryMethod0Name = 'storePickup';
        continue;
      }
      if (deliveryMethod0Name == "Pósthús") {
        deliveryMethod0Name = 'postoffice';
        continue;
      }
      if (deliveryMethod0Name == "Smápakki") {
        deliveryMethod0Name = 'smallParcel';
        continue;
      }
      if (deliveryMethod1Name == "Póstbox") {
        deliveryMethod1Name = 'postbox';
        continue;
      }
      if (deliveryMethod1Name == "Heimkeyrsla") {
        deliveryMethod1Name = 'homeDelivery';
        continue;
      }
      if (deliveryMethod1Name == "Afhent í verslun") {
        deliveryMethod1Name = 'storePickup';
        continue;
      }
      if (deliveryMethod1Name == "Pósthús") {
        deliveryMethod1Name = 'postoffice';
        continue;
      }
      if (deliveryMethod1Name == "Smápakki") {
        deliveryMethod1Name = 'smallParcel';
        continue;
      }
      if (deliveryMethod2Name == "Póstbox") {
        deliveryMethod2Name = 'postbox';
        continue;
      }
      if (deliveryMethod2Name == "Heimkeyrsla") {
        deliveryMethod2Name = 'homeDelivery';
        continue;
      }
      if (deliveryMethod2Name == "Afhent í verslun") {
        deliveryMethod2Name = 'storePickup';
        continue;
      }
      if (deliveryMethod2Name == "Pósthús") {
        deliveryMethod2Name = 'postoffice';
        continue;
      }
      if (deliveryMethod2Name == "Smápakki") {
        deliveryMethod2Name = 'smallParcel';
        continue;
      }
      if (deliveryMethod3Name == "Póstbox") {
        deliveryMethod3Name = 'postbox';
        continue;
      }
      if (deliveryMethod3Name == "Heimkeyrsla") {
        deliveryMethod3Name = 'homeDelivery';
        continue;
      }
      if (deliveryMethod3Name == "Afhent í verslun") {
        deliveryMethod3Name = 'storePickup';
        continue;
      }
      if (deliveryMethod3Name == "Pósthús") {
        deliveryMethod3Name = 'postoffice';
        continue;
      }
      if (deliveryMethod3Name == "Smápakki") {
        deliveryMethod3Name = 'smallParcel';
        continue;
      }
      if (deliveryMethod4Name == "Póstbox") {
        deliveryMethod4Name = 'postbox';
        continue;
      }
      if (deliveryMethod4Name == "Heimkeyrsla") {
        deliveryMethod4Name = 'homeDelivery';
        continue;
      }
      if (deliveryMethod4Name == "Afhent í verslun") {
        deliveryMethod4Name = 'storePickup';
        continue;
      }
      if (deliveryMethod4Name == "Pósthús") {
        deliveryMethod4Name = 'postoffice';
        continue;
      }
      if (deliveryMethod4Name == "Smápakki") {
        deliveryMethod4Name = 'smallParcel';
        continue;
      }
    }

    var myInit = {
                'method': 'PUT',
                'body': JSON.stringify({
                  // 'active': isActive,
                  // 'useDefaultDeliverySettings': useDefaultDeliverySettings,
                  [`${deliveryMethod0Name}`]: {
                    'useDefaultPrice': deliveryMethod0UseDefaultPrice,
                    'customPrice': deliveryMethod0CustomPrice,
                    'enabled': deliveryMethod0Enabled
                  },
                  [`${deliveryMethod1Name}`]: {
                    'useDefaultPrice': deliveryMethod1UseDefaultPrice,
                    'customPrice': deliveryMethod1CustomPrice,
                    'enabled': deliveryMethod1Enabled
                  },
                  [`${deliveryMethod2Name}`]: {
                    'useDefaultPrice': deliveryMethod2UseDefaultPrice,
                    'customPrice': deliveryMethod2CustomPrice,
                    'enabled': deliveryMethod2Enabled
                  },
                  [`${deliveryMethod3Name}`]: {
                    'useDefaultPrice': deliveryMethod3UseDefaultPrice,
                    'customPrice': deliveryMethod3CustomPrice,
                    'enabled': deliveryMethod3Enabled
                  },
                  [`${deliveryMethod4Name}`]: {
                    'useDefaultPrice': deliveryMethod4UseDefaultPrice,
                    'customPrice': deliveryMethod4CustomPrice,
                    'enabled': deliveryMethod4Enabled
                  }
                }),
                'headers': myHeaders,
                'mode': 'cors',
                'cache': 'default'
              };

    let request = new Request(url, myInit);

    fetch(request)
    .then(response => {
      return response;
    }).then(function(response) {
      if (response.status == 200) {
        toastr.success('Vistaði stillingar');
      } else {
        toastr.error('Eitthvað fór úrskeiðis, response status: '+response.status);
      }
    }).catch(function(error) {
      toastr.error('Eitthvað fór úrskeiðis, error: '+error);
      console.log(error);
    });
  }

  function onGetWebshopsButtonClick(e) {
    e.preventDefault();

    let birtaVefverslanir = document.querySelector('.birtaVefverslanir');

    let url = `http://${sa_environment}/sa/webshops`;

    var myHeaders = new Headers({
      "Authorization": token
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
      createWebshopList(response.webshops, birtaVefverslanir);
    }).catch(function(error) {
      console.log(error);
    });
  }

  function createWebshopList(array, elementToAttachTo) {
    for (var i = 0; i < array.length; i++) {
      let webshop = array[i];
      let item = document.createElement('li');
      item.innerHTML = `Store ID: ${webshop.storeId}`;
      elementToAttachTo.appendChild(item);
    }
  }

  function onGetWebshopSettingsButtonClick(e) {
    e.preventDefault();

    let birtaStillingar = document.querySelector('.birtaStillingar');

    let url = `http://${sa_environment}/sa/webshopsettings?storeId=${store}`;

    var myHeaders = new Headers({
      "Authorization": token
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
      showSettings(response)
      toastr.success('Tókst að ná í stillingar');
    }).catch(function(error) {
      toastr.error(error);
    });
  }

  function showSettings(settings) {
    // let isActive = document.querySelector('.isActive');
    // let useDefaultDelivery = document.querySelector('.defaultDeliveryMethods');
    //
    // if (settings.active === true) {
    //   isActive.checked = true;
    // }
    // if (settings.useDefaultDeliverySettings === true) {
    //   useDefaultDelivery.checked = true;
    // }

    for (var i = 0; i < settings.deliveryMethods.length; i++) {
      let delmethod = settings.deliveryMethods[i];
      let div = document.querySelector(`.deliveryMethod${i}`)
      let header = document.querySelector(`.deliveryMethod${i}Header`)
      let methodEnabled = document.querySelector(`.deliveryMethod${i}Enabled`);
      let useDefaultPrice = document.querySelector(`.deliveryMethod${i}UseDefaultPrice`);
      let customPrice = document.querySelector(`.deliveryMethod${i}CustomPrice`);
      if (delmethod.enabled === true) {
        methodEnabled.checked = true;
      }
      if (delmethod.useDefaultPrice === true) {
        useDefaultPrice.checked = true;
      }
      customPrice.value = delmethod.customPrice;
      if (header.textContent != "") {
        header.textContent = "";
      }

      header.append(delmethod.name);

      if (delmethod.hasLocations) {
        let locationDiv = document.createElement('div');
        locationDiv.classList.add('flex');
        div.appendChild(locationDiv);
        let listOfLocations = document.createElement('ul');
        listOfLocations.classList.add('locationList');
        locationDiv.appendChild(listOfLocations);

        if (delmethod.locations.length > 0) {
          let locationList = document.querySelector('.locationList');

          for (var j = 0; j < delmethod.locations.length; j++) {
            let name = delmethod.locations[j].name;
            let address = delmethod.locations[j].address;
            let listItem = document.createElement('li');
            listItem.classList.add('flex');
            let textNode = document.createTextNode(`${name} - ${address}`);
            let delButton = document.createElement('button');
            let delText = document.createTextNode(`Delete location`);
            let br = document.createElement('br');
            delButton.appendChild(delText);
            delButton.classList.add('btn', 'btn-sm', 'btn-danger');
            delButton.addEventListener('click', onDeleteLocationClick)

            listItem.appendChild(textNode);
            listItem.appendChild(delButton);
            locationList.appendChild(listItem);
            locationList.appendChild(br);
          }
        }

        customPrice.classList.add('breathe');

        let checkIfCreateLocationButtonExists = document.querySelector('.createLocationButton');
        if (checkIfCreateLocationButtonExists === null) {
          let button = document.createElement('button');
          button.classList.add('btn', 'btn-primary');
          button.classList.add('createLocationButton');
          let textNode = document.createTextNode('Create location');
          button.appendChild(textNode);
          locationDiv.appendChild(button);
        }

        let createLocationButton = document.querySelector('.createLocationButton');
        createLocationButton.addEventListener('click', function() { onCreateLocationButtonClick(locationDiv) });
      }
    }
  }

  function onDeleteLocationClick(e) {
    e.preventDefault();

    let strArr = this.parentElement.textContent.split("-");
    let locationToDelete = strArr[0].substring(0, strArr[0].length-1);

    let url = `http://${sa_environment}/sa/locations?storeId=${store}&locationName=${locationToDelete}`;

    var myHeaders = new Headers({
      "Authorization": token,
      'Content-Type': 'application/json',
    });

    var myInit = {
                'method': 'DELETE',
                'headers': myHeaders,
                'mode': 'cors',
                'cache': 'default'
              };

    let request = new Request(url, myInit);

    fetch(request)
    .then(response => {
      return response;
    }).then(function(response) {
      toastr.success('Eyddi location');
      console.log("Eyddi location");
    }).catch(function(error) {
      console.log(error);
    });
  }

  function onCreateLocationButtonClick(locationDiv) {

    let nameField = document.createElement('input');
    nameField.classList.add('nameField', 'locationInputs');
    nameField.setAttribute('type', 'text');
    nameField.setAttribute('placeholder', 'location name');
    let addressField = document.createElement('input');
    addressField.classList.add('addressField', 'locationInputs');
    addressField.setAttribute('type', 'text');
    addressField.setAttribute('placeholder', 'address');
    locationDiv.appendChild(nameField);
    locationDiv.appendChild(addressField);

    let saveLocationButton = document.createElement('button');
    saveLocationButton.classList.add('btn', 'btn-success');
    saveLocationButton.classList.add('createLocationButton');
    let textNode = document.createTextNode('Save location');
    saveLocationButton.appendChild(textNode);
    locationDiv.appendChild(saveLocationButton);

    saveLocationButton.addEventListener('click', onSaveLocationButtonClick);
  }

  function onSaveLocationButtonClick(e) {
    e.preventDefault();

    let name = document.querySelector('.nameField');
    let address = document.querySelector('.addressField');
    if (name.value == "" || address.value == "") {
      toastr.info('YO! Verður að fylla út báða reiti ^_^')
       return;
    }

    let url = `http://${sa_environment}/sa/locations?storeId=${store}&name=${name.value}&address=${address.value}`;

    var myHeaders = new Headers({
      "Authorization": token,
      'Content-Type': 'application/json',
    });

    var myInit = {
                'method': 'POST',
                'headers': myHeaders,
                'mode': 'cors',
                'cache': 'default'
              };

    let request = new Request(url, myInit);

    fetch(request)
    .then(response => {
      return response;
    }).then(function(response) {
      address.value = "";
      name.value = "";
      toastr.success('Bjó til location');
      console.log("Bjó til location");
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
