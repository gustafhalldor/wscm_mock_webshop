var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Test-vefverslun Póstsins' });
});

/* GET basket contents. */
router.get('/basket', function(req, res, next) {
  res.render('basket', { title: 'Basket case' });
});

router.post('/checkout', function(req, res, next) {
//  let url = `http://localhost:8989/wscm/v1/landing/`;

  // var myHeaders = new fetch.Headers();
  // //myHeaders.set("Accept", "text/plain");
  // myHeaders.set("Content-Type", "application/json");
  // myHeaders.set("x-api-key", "4F/UEh52hA86NWTQyM6+ogYGEsOClgD19jfrwl4Ol2E=");
  //
  // var myInit = {
  //               'method': 'POST',
  //               'body': JSON.stringify({
  //                 'recipient': {
  //                   'fullName': 'Gústi með geggjaðlangtnafn',
  //                   'address': 'Hagamel',
  //                   'postcode': 107,
  //                   'email': "",
  //                   'phone': ""
  //                 },
  //                 "products": [
  //                   {
  //                     "description": "Hátalari",
  //                     "weight": 2,
  //                     "price": 5000
  //                   },
  //                   {
  //                     "description": "Talstöð(x2)",
  //                     "weight": 0.5,
  //                     "price": 5000
  //                   }
  //                 ]
  //               }),
  //               'headers': myHeaders,
  //               'mode': 'cors',
  //               'cache': 'default'
  //             };
  //
  // let request = new fetch.Request(url, myInit)
  //
  // fetch(request)
  // .then(response => {
  //   return response.json();
  // })
  // .then(function(response) {
  //   console.log(response.key);
  //   // Láta þetta redirect-a yfir á React síðuna
  //   const url = encodeURIComponent(response.key)
  //   console.log(url);
  //   res.redirect(`http://localhost:3000/${url}`);
  // })
  // .catch(function(error) {
  //   console.log("fetch unsuccessful, error: ");
  //   console.log(error);
  // });

  let mappedProducts = [];
  for (var i = 0; i < req.body.length; i++) {
    const product = req.body[i];
    if (product.count > 0) {
      mappedProducts.push({
        description: product.name,
        pricePerItem: product.price,
        weight: product.weight,
        count: product.count,
      })
    }
  }
console.log("mappedProducts er:");
  console.log(mappedProducts);
console.log("req.body er");
console.log(req.body);
  axios({
      method: 'post',
      url: `http://localhost:8989/wscm/v1/landing/`,
      headers: {'x-api-key': '4F/UEh52hA86NWTQyM6+ogYGEsOClgD19jfrwl4Ol2E='},
      data: {
        'recipient': {
          'fullName': 'Gústi með geggjaðlangtnafn',
          'address': 'Hagamel',
          'postcode': 107,
          'email': "",
          'phone': ""
        },
        "products": mappedProducts
      },
    })
      .then(response => {
        console.log(response)
        const url = encodeURIComponent(response.data.key);
        res.setHeader("Content-Type", "text/html");
        let retStatus = 'Success';
        res.send({
          retStatus : retStatus,
          redirectTo: `http://localhost:3000/${response.data.key}`,
          msg : 'Just go there please' // this should help
        });
      })
      .catch(error => {
        // If no API key is found behind the redirect key, a "400" status is returned.
        const obj = {
          status: error.response.status,
          message: error.response.data.message,
        };
        res.send(obj);
      })

});

router.get('/step2', function(req, res, next) {
  console.log(req.query);
  // Fetcha úr apanum og svo rendera og láta breytu fylgja með sem inniheldur sendingarleiðirnar
  let country = req.query.country;
  let pc = req.query.postcode;
  let weight = req.query.weight;
  let height = req.query.height;
  let width = req.query.width;
  let length = req.query.length;
  let typeOfKey = req.query.typeOfKey;
  //let url = `https://www.postur.is/umbraco/Surface/ShippingAssistant/GetDeliveryServices?Language=is&CountryCode=${country}&PostCode=${pc}&Weight=${weight}&Length=${length}&Width=${width}&Height=${height}`;
  //let url = `http://localhost:8989/wscm/deliveryprices?Language=is&countryCode=${country}&postCode=${pc}&weight=${weight}&length=${length}&width=${width}&height=${height}`;
  let url = `http://test-ws.epost.is:8989/wscm/v1/deliveryservicesandprices?Language=is&countryCode=${country}&postCode=${pc}&weight=${weight}&length=${length}&width=${width}&height=${height}`;

   var myHeaders = new fetch.Headers();
   myHeaders.set("Content-Type", "text/plain");
   if (typeOfKey === 'active') {
     myHeaders.append("x-api-key", "4F/UEh52hA86NWTQyM6+ogYGEsOClgD19jfrwl4Ol2E=");
   } else {
     myHeaders.append("x-api-key", "asdfdsfh");
   }

   var myInit = { 'method': 'GET',
               'headers': myHeaders,
               'mode': 'cors',
               'cache': 'default' };

  let request = new fetch.Request(url, myInit)

  fetch(request)
    .then(function(res) {
      console.log(res.status);
      if (res.status == 200) {
        return res.json();
      }
      return res.statusText
    }).then(function(res2) {
      console.log(res2);
      let message = "";
      if (res2 == "Unauthorized") {
        message = res2;
        res.render('step2', { title: 'Unauthorized', message });
      } else {
        res.render('step2', { title: 'step2', message, data: res2.deliveryServicesAndPrices });
      }
    })
    .catch(error => {
      console.log("eitthvað í gangi", error);
    });
});

router.get('/api', function(req, res, next) {

  res.render('apiShowRoom', {});
});

router.get('/api/createKey', function(req, res, next) {
  //
  res.render('apiShowRoom', {});
});

router.get('/webshopUsingWscm', (req, res, next) => {
  res.render('storeUsingOurServices', {});
});

router.get('/webshopUI', (req, res, next) => {
  res.render('webshopUIinSA', {});
});


module.exports = router;
