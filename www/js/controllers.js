angular.module('starter.controllers', ['ionic', 'starter.services'])

.controller('DashCtrl', function($scope, $state, Proximiio, GeofenceAPI, $ionicLoading, $cordovaLocalNotification) {
  $scope.entered = "Discovering...";
  $scope.output = "Waiting...";
  $scope.geostatus = "Awaiting status...";
  $scope.inputType = "Discovering...";
  $scope.inputObject = "Discovering...";
  $scope.lastPositionLatitude = "Discovering...";
  $scope.lastPositionLongitude = "Discovering...";
  $scope.token = null;

  ionic.Platform.ready(function() {

    function notify(title, text) {
      var counter = localStorage.counter ? parseInt(localStorage.counter) % 20 : 0;
      localStorage.counter = ++counter;
      console.info('alarm details: ', counter, title, text);
      localStorage.proxilogs += ' notify (alarm id:' + counter + ',' + title + ',' + new Date().toLocaleString() +
        ");";

      var now = new Date().getTime();
      var no_of_secondes = 30;
      var secs_from_now = new Date(now + (1000 * no_of_secondes));

      $cordovaLocalNotification.schedule({
        title: 'Proximiio: ' + title,
        text: text,
        id: counter,
        at: secs_from_now
      });
    }

    var outputTriggerCallback = function(output) {
      localStorage.proxilogs += 'outputTriggerCallback (' + new Date().toLocaleString() + ");";
      console.log('outputTriggerCallback called');
      $scope.output = output;
      $scope.$apply();
    };

    var inputTriggerCallback = function(entered, geofence) {
      localStorage.proxilogs += 'inputTriggerCallback (' + new Date().toLocaleString() + ");";

      console.log('inputTriggerCallback called');
      $scope.entered = entered;
      $scope.inputType = geofence.name;
      $scope.lastPositionLatitude = geofence.area.lat;
      $scope.lastPositionLongitude = geofence.area.lon;
      $scope.inputObject = JSON.stringify(geofence, null, 2);
      $scope.$apply();
    };

    var positionChangeCallback = function(coords) {
      localStorage.proxilogs += 'positionChangeCallback (' + new Date().toLocaleString() + ");";
      $scope.lastPositionLatitude = coords.coordinates.lat;
      $scope.lastPositionLongitude = coords.coordinates.lon;

      var title = 'loc changed';
      var text = new Date().toLocaleString();
      console.log(title, text, new Date().toLocaleString());

      $scope.$apply();
    };

    var geofenceTriggerCallback = function(enter, geofence) {
      console.log('geofence triggered: ', geofence);

      localStorage.proxilogs += 'geofenceTriggerCallback (' + new Date().toLocaleString() + ");";

      var action = enter === 1 ? 'enter' : 'exit';
      var title = action + ' ' + geofence.address;
      var text = new Date().toLocaleString();
      notify(title, text);

      localStorage.triggers = localStorage.triggers || '';
      localStorage.triggers += title.substr(0, 30) + ' ' + text + ';'; //store alarm triggers info locally

      $scope.$apply();
    };

    Proximiio.init(outputTriggerCallback, inputTriggerCallback, positionChangeCallback, geofenceTriggerCallback);


    //
    // part two
    //
    $scope.clean_up_array = function(array) {
      var result = [];
      for (var i = 0; i < array.length; i++) {
        if (array[i] !== "" && result.indexOf(array[i]) < 0) {
          result.push(array[i]);
        }
      }
      return result;
    };

    $scope.triggers = localStorage.triggers ? localStorage.triggers.split(';') : [];
    $scope.triggers = $scope.clean_up_array($scope.triggers);

    $scope.load_triggers = function() {

      $ionicLoading.show({
        template: 'Refreshing local logs...',
        duration: 2000
      });

      $scope.triggers = localStorage.triggers ? localStorage.triggers.split(';') : [];
      $scope.triggers = $scope.clean_up_array($scope.triggers);
    };

    $scope.should_display_triggers = function() {
      return $scope.triggers.length > 0;
    };

    $scope.events = [];
    $scope.load_events = function() {
      $ionicLoading.show({
        template: 'Loading proximiio events...',
        duration: 1000
      });

      GeofenceAPI.get_all_events(
        function(events) {
          console.log('No of events fetched:', events.length);

          $scope.events = [];
          for (var i = 0; i < events.length; i++) {
            var event = events[i];
            if (event.event === 'config-change') { // skip config-change
              continue;
            }

            $scope.events.push({
              'label': event.data.geofence,
              'action': event.event,
              'date': new Date(event.updatedAt).toLocaleString()
            });
          }

        },
        function(error) {
          console.log('login error:', error);
        });
    };

    $scope.load_events();


    GeofenceAPI.get_all_geofences(function(geofences) {
      console.log('geofences: ', geofences);
    }, function(error) {
      console.log('login error:', error);
    });

    $scope.create = function() {
      GeofenceAPI.create_geofence({
        "id": "string",
        "remote_id": "string",
        "name": "string",
        "address": "string",
        "organization_id": "string",
        "radius": 100,
      }, function(data) {
        console.log('create geofence resp:', data);
      }, function(error) {
        console.log('error:', error);
      });
    };
  });

})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('GeofencesCtrl', function($scope, $ionicLoading, GeofenceAPI) {
  $scope.geofences = [];

  $scope.refresh = function() {
    GeofenceAPI.get_all_geofences(function(geofences) {
      $scope.geofences = geofences;
      $ionicLoading.hide();
      console.log('No of geofences:', $scope.geofences.length);
    }, function(error) {
      console.log('update geofences error:', error);
    });
  };
  $scope.refresh();

  $scope.remove = function(geofence) {
    console.log('removing geofence: ', geofence.id);

    $ionicLoading.show({
      template: 'Deleting...',
      hideOnStateChange: true
    });

    GeofenceAPI.delete_geofence({
      id: geofence.id
    }, function(resp) {
      console.log('geofences get resp: ', resp);
      $scope.refresh();
    }, function(error) {
      console.log('delete error:', error);
      $ionicLoading.hide();
      $scope.refresh();
    });
  };

  $scope.info = function(geofence) {
    console.log('info clicked');

    $ionicLoading.show({
      duration: 3000,
      template: '<strong>' + geofence.name + '</strong><br>' +
        '<strong>geofence radius</strong>: ' + geofence.radius + 'm <br>' +
        '<strong>updated</strong>: ' + new Date(geofence.updatedAt).toLocaleString() + '<br>' +
        '<strong>address</strong>: ' + geofence.address + '<br>'
    });

    GeofenceAPI.get_geofence({
      id: geofence.id
    }, function(resp) {
      console.log('get resp: ', resp);
    }, function(error) {
      $ionicLoading.hide();
      console.log('get error: ', resp);
    });
  };

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
