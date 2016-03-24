# Proximi.io Ionic Demo Application #

### Installation / Usage ###

1. Edit www/js/services.js
2. find line containing "proximiio.setIDandAuthToken" and replace your APP key & Authentication Token. (you can find these on Proximi.io Portal)

```
  proximiio.setIDandAuthToken("YOUR_APP_KEY", "YOUR_AUTH_TOKEN", null, null);
```
3. run npm install to install the required dependencies
4. use "ionic run android --device" or "ionic run ios --device" to run the application on device.