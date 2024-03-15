// Initialize the token variable
let accessToken = "";
var axios = require("axios").default;

// Function to get access token
function getAccessToken(price) {
    const authOptions = {
        method: 'post',
        url: 'https://uat.setu.co/api/v2/auth/token', // Use the proxy server URL
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            "clientID": "7eb0314d-fe4c-40cb-9525-061a1634de28",
            "secret": "4fc3cec7-9f75-4d7f-9806-600d6274980f"
        }
    };

    axios.request(authOptions).then(function (response) {
        if (response.status === 200 && response.data.success) {
            accessToken = response.data.data.token;
            // Do not call makePayment here; call it after the user clicks the "Buy Now" button
            makePayment(price);
        } else {
            console.error('Error getting access token');
        }
    }).catch(function (error) {
        console.error(error);
    });
}

function makePayment(price) {
    var options = {
        method: 'post',
        url: 'https://uat.setu.co/api/v2/payment-links', // Use the proxy server URL
        headers: {
            'X-Setu-Product-Instance-ID': '1362076550198986160',
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        data: {
          "billerBillID": "29GGGGG1314R9Z6",
                "amount": {
                  "currencyCode": "INR",
                  "value": price
                },
                "expiryDate": "2024-12-06T12:34:28Z",
                "amountExactness": "EXACT",
                "settlement": {
                  "primaryAccount": {
                    "ifsc": "SBIN0021991",
                    "id": "021000021",
                    "name": "temp"
                  }
                },
                "validationRules": {
                  "sourceAccounts": [
                    {
                      "ifsc": "Testing",
                      "number": "021000099"
                    }
                  ]
                }
      }
    };

    axios.request(options).then(function (response) {
        if (response.status === 200 && response.data.success) {
            var paymentLink = response.data.data.paymentLink.shortURL;
            window.open(paymentLink, '_blank');
        } else {
            console.error(response.data);
            alert('Error initiating payment. Please check the console for details.');
        }
    }).catch(function (error) {
        console.error(error);
        alert('Error initiating payment. Please check the console for details.');
    });
}

// Call the function to get the access token before making the payment
getAccessToken(price);
