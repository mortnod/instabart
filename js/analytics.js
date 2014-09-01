var Analytics = {

  init: function() {
    // @if ENV='phone'
    navigator.analytics.setTrackingId('UA-52384192-1');
    this.trackAppActivation();
    // @endif
    this.createEventTrackers();
    this.createScheduleEventTrackers();
  },

  // Helper method to normalEvent() and outBoundEvent()
  sendEvent: function(category, action) {
    // @if ENV='web'
    try {
      _gaq.push(['_trackEvent', category, action]);
    } catch(err){}
    // @endif

    // @if ENV='phone'
    navigator.analytics.sendEvent(category, action);
    // @endif
  },

  // Sends data to Analytics. The 'selector' parameter is optional
  normalEvent: function(category, action, selector) {
    if (selector === undefined) {
      Analytics.sendEvent(category, action);
    }
    else {
      $(selector).click(function(){
        Analytics.sendEvent(category, action);
      });
    }
  },

  // Sends data to Analytics and redirects (after a slight delay)
  outboundEvent: function(category, action, selector) {
    var eventTrigger = $(selector);

    eventTrigger.click(function(e){
      // Send tracking information to Google Analytics
      Analytics.sendEvent(category, action);

      // If CTRL or CMD is pressed (to open the link in a new tab),
      // proceed using the browsers default action
      if (e.metaKey || e.ctrlKey) { return; }

      // Otherwise, stop the motherfucker
      e.preventDefault();

      // Small timeout to ensure that the event is tracked
      // before following the link
      setTimeout(function() {
        // @if ENV='web'
        document.location.href = eventTrigger.prop('href');
        // @endif

        // @if ENV='phone'
        window.open(eventTrigger.prop('href'), '_system');
        // @endif
      }, 100);

    });
  },

  createEventTrackers: function() {
    this.outboundEvent('Main Links', 'Itslearning', '#itslearning .track-main');
    this.outboundEvent('Main Links', 'Email', '#email .track-main');
    this.outboundEvent('Main Links', 'StudentWeb', '#studweb .track-main');
    this.outboundEvent('Main Links', 'SIT Dinner', '#dinner .track-main');
    this.outboundEvent('Main Links', 'Campus Map', '#map .track-main');
    this.outboundEvent('Main Links', 'Bartebuss', '#bartebuss .track-main');
    this.outboundEvent('Main Links', 'Training', '#training .track-main');
    this.outboundEvent('Main Links', 'Room Reservation', '#romres .track-main');
    this.outboundEvent('Main Links', 'Software Download', '#software .track-main');
    this.outboundEvent('Main Links', 'Software Farm', '#farm .track-main');
    this.outboundEvent('Main Links', 'Video Lectures', '#film .track-main');

    this.normalEvent('Card Flips', 'Itslearning', '#itslearning .flip-open');
    this.normalEvent('Card Flips', 'Email', '#email .flip-open');
    this.normalEvent('Card Flips', 'Schedule', '#schedule .flip-open');
    this.normalEvent('Card Flips', 'StudentWeb', '#studweb .flip-open');
    this.normalEvent('Card Flips', 'SIT Dinner', '#dinner .flip-open');
    this.normalEvent('Card Flips', 'Campus Map', '#map .flip-open');
    this.normalEvent('Card Flips', 'Bartebuss', '#bartebuss .flip-open');
    this.normalEvent('Card Flips', 'Training', '#training .flip-open');
    this.normalEvent('Card Flips', 'Room Reservation', '#romres .flip-open');
    this.normalEvent('Card Flips', 'Software Download', '#software .flip-open');
    this.normalEvent('Card Flips', 'Software Farm', '#farm .flip-open');
    this.normalEvent('Card Flips', 'Video Lectures', '#film .flip-open');

    this.normalEvent('Modal', 'Show Modal', '#about-button');
    this.outboundEvent('Modal', 'Send Email to Instabart', '#track-email');
    this.outboundEvent('Modal', 'Follow on Twitter', '#track-twitter');
    this.outboundEvent('Modal', 'Fork on Github', '#track-github');
    this.outboundEvent('Modal', 'Online Notifier', '#notifier');
    this.outboundEvent('Modal', 'FileSender', '#track-filesender');
    this.outboundEvent('Modal', 'Grade Statistics', '#track-grades');
    this.outboundEvent('Modal', 'IT Help', '#track-ithelp');
    this.outboundEvent('Modal', 'Kundesenteret', '#track-kundesenteret');
    this.outboundEvent('Modal', 'jQuery (built with)', '#track-jquery');
    this.outboundEvent('Modal', 'Modernizr (built with)', '#track-modernizr');
    this.outboundEvent('Modal', 'Sass (built with)', '#track-sass');
    this.outboundEvent('Modal', 'Entypo (built with)', '#track-entypo');
    this.outboundEvent('Modal', 'Lean Modal (built with)', '#track-leanmodal');
    this.outboundEvent('Modal', 'Handlebars (built with)', '#track-handlebars');
    this.outboundEvent('Modal', 'Normalize (built with)', '#track-normalize');
    this.outboundEvent('Modal', 'Icomoon (built with)', '#track-icomoon');
    this.outboundEvent('Modal', 'Glyphicons (built with)', '#track-glyphicons');
    this.outboundEvent('Modal', 'Visual Basic (built with)', '#track-vb');

    this.outboundEvent('Other Links', 'mvn.no', '#track-mvn');
    this.outboundEvent('Other Links', 'https://innsida.ntnu.no/wiki/-/wiki/Norsk/Programfarm', '#track-farm-extra');
    this.outboundEvent('Other Links', 'http://www.ntnu.no/studieinformasjon/rom/', '#track-romres-extra');
    this.outboundEvent('Other Links', 'https://innsida.ntnu.no/wiki/-/wiki/Norsk/Slik+bruker+du+webmail#section-Slik+bruker+du+webmail-Videresende+epost+til+andre+kontoer', '#track-email-extra');
  },

  createScheduleEventTrackers: function() {
    if (Schedule.supportsLocalStorage() && !Schedule.firstTimeSetupCompleted()){
      this.normalEvent('Schedule Settings', 'Show Settings (first time)', '#schedule .track-main');
    }
    else {
      this.outboundEvent('Main Links', 'Schedule', '#schedule .track-main');
    }

    $('#schedule-yes-button').click(function(){
      if (Schedule.inputValid()) {
        this.normalEvent('Schedule Settings', 'Yes (remember schedule)');
      }
    });

    this.normalEvent('Schedule Settings', "No (don't remember schedule)", '#schedule-no-button');

    if (Schedule.firstTimeSetupCompleted()){
      this.normalEvent('Schedule Settings', 'Show Settings', '#schedule-settings-button');
    }
    else {
      this.normalEvent('Schedule Settings', 'Show Settings (first time)', '#schedule-settings-button');
    }
  },

  trackAppActivation: function() {
    if (Schedule.supportsLocalStorage() && localStorage['app_activated'] === undefined){
      this.normalEvent('Activations', device.platform);
      localStorage['app_activated'] = 'true';
    }
  }
};