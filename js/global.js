(function() {
  function init() {
    Card.init();
    Schedule.init();
    Header.init();
    Analytics.init();
  }

  // @if ENV='web'
  init();
  // @endif

  // @if ENV='phone'
  function fixStatusBarIniOS7() {
    if (window.device.platform === 'iOS' && parseFloat(window.device.version) >= 7.0){
      StatusBar.overlaysWebView(false);
    }
  }

  document.addEventListener('deviceready', function(){
      init();
      fixStatusBarIniOS7();
  }, true);
  // @endif

})();