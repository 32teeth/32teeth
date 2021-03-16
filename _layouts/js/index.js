/*
** @author Eugene Andruszczenko
** @version 0.1
** @date September 18th, 2015
** @description 
** app.js
*/
var app = {
  initialize: function() {
    this.bindEvents();
  },
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener('DOMContentLoaded', this.onDeviceReady, false);
  },
  onDeviceReady: function() {
    /*
    ** @prop ids {object}
    ** @desc ids for admob
    */
   /*
    var ids = {
      Android:{
        banner:"ca-app-pub-9120125626734968/3972671855",
        interstitial:"ca-app-pub-9120125626734968/1127016666"
      },
      iOS:{
        banner:"ca-app-pub-9120125626734968/3972671855",
        interstitial:"ca-app-pub-9120125626734968/1127016666"
      }
    }   

    //AppRate.preferences.storeAppURL.ios = 'id1046563888';
    //AppRate.preferences.storeAppURL.android = 'market://details?id=com.fakesite.lander';

    ads.ids = ids[device.platform];
    ads.interstitial();    
    */
    game.init();
  }
};
app.initialize();