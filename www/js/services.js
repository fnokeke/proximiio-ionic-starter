angular.module('starter.services', ['ngResource'])
  .factory("Const", function() {
    var TOKEN = '';

    return {
      'PROXIMIIO_TOKEN': TOKEN
    };

  })

.factory("Proximiio", function(Const) {
  return {
    init: function(outputTriggerCallback, inputTriggerCallback, positionChangeCallback, geofenceTriggerCallback) {
      proximiio.setToken(Const.PROXIMIIO_TOKEN);
      proximiio.setDebugOutput(true, true, true);
      proximiio.setOutputTriggerCallback(outputTriggerCallback);
      proximiio.setInputTriggerCallback(inputTriggerCallback);
      proximiio.setPositionChangeCallback(positionChangeCallback);
      proximiio.setGeofenceTriggerCallback(geofenceTriggerCallback);
    }
  };
})

.factory("GeofenceAPI", function($resource, Const) {
  var TIMEOUT = 5000; //no of milliseconds
  var BASE_URL = 'https://api.proximi.fi';
  var HEADERS = {
    'Authorization': 'Bearer ' + Const.PROXIMIIO_TOKEN
  };

  return $resource('', {}, {

    'create_geofence': {
      method: 'POST',
      headers: HEADERS,
      url: BASE_URL + '/core/geofences',
      timeout: TIMEOUT
    },

    'delete_geofence': {
      method: 'DELETE',
      headers: HEADERS,
      url: BASE_URL + '/core/geofences/:id',
      timeout: TIMEOUT
    },

    'get_geofence': {
      method: 'GET',
      headers: HEADERS,
      url: BASE_URL + '/core/geofences/:id',
      timeout: TIMEOUT
    },

    'get_all_geofences': {
      method: 'GET',
      headers: HEADERS,
      url: BASE_URL + '/core/geofences',
      timeout: TIMEOUT,
      isArray: true
    },

    'get_all_events': {
      method: 'GET',
      headers: HEADERS,
      url: BASE_URL + '/core/events',
      timeout: TIMEOUT,
      isArray: true
    }

  });

});
