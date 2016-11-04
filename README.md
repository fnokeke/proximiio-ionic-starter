# Proximi.io Ionic Demo Application #

### Installation / Usage ###

1. Edit www/js/services.js
2. find line containing "PROXIMIIO_TOKEN" and replace your Authentication Token. (you can find this from the Proximi.io Web Portal Applications section/use REST API -- more details below)

```
  var PROXIMIIO_TOKEN = "YOUR_TOKEN";
```
3. run npm install to install the required dependencies
4. use "ionic run android --device" or "ionic run ios --device" to run the application on device.

### Rest API ###
Rest API Factory set up in www/js/services.js

You can also create an account using the API. Look [here](https://proximi.io/docs/rest-api/#create-a-application) and [here](https://api.proximi.fi/core_explorer/#!/event/index)to config more REST functions;
