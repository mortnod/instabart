(function() {
  function init() {
    Card.init();
    Schedule.init();
    Header.init();
    Analytics.init();
    Alerts.init();
    Links.init();
    new Hotkeys();
  }

  init();
})();
