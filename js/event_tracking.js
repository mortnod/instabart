$(document).ready(function(){
  // Use this function when tracking external links
  function trackOutboundLink(link, e, category, action) {

    // Send tracking information to Google Analytics
    try {
      _gaq.push(['_trackEvent', category , action]);
    } catch(err){}

    // If cmd or ctrl is pressed (to open the link in a new tab), proceed using the browsers default action
    if (e.metaKey || e.ctrlKey) return;
    
    // Otherwise, stop the motherfucker
    e.preventDefault();

    // Small timeout to ensure that the event is tracked
    // before following the link
    setTimeout(function() {
      document.location.href = link.href;
    }, 100);
  }

  // MAIN LINKS
  // Event tracking for the main links
  $('#itslearning .track-main').click(function(e){
    trackOutboundLink(this, e, 'Main Links', 'Itslearning');
  });

  $('#email .track-main').click(function(e){
    trackOutboundLink(this, e, 'Main Links', 'Email');
  });

  $('#schedule .track-main').click(function(e){
    /* 
      Only redirect if the card has been clicked before.
      (A prompt asking if you want to remember the schedule
      name will be displayed the first time.)
    */
    if (supportsLocalStorage()){
      if (hasClickedScheduleBefore()){
        trackOutboundLink(this, e, 'Main Links', 'Schedule');
      }
    }
    else {
      trackOutboundLink(this, e, 'Main Links', 'Schedule');
    }
  });

  $('#studweb .track-main').click(function(e){
    trackOutboundLink(this, e, 'Main Links', 'StudentWeb');
  });

  $('#dinner .track-main').click(function(e){
    trackOutboundLink(this, e, 'Main Links', 'SIT Dinner');
  });

  $('#map .track-main').click(function(e){
    trackOutboundLink(this, e, 'Main Links', 'Campus Map');
  });

  $('#filesender .track-main').click(function(e){
    trackOutboundLink(this, e, 'Main Links', 'FileSender');
  });

  $('#grades .track-main').click(function(e){
    trackOutboundLink(this, e, 'Main Links', 'Grade Statistics');
  });

  $('#romres .track-main').click(function(e){
    trackOutboundLink(this, e, 'Main Links', 'Room Reservation');
  });

  $('#it-hjelp .track-main').click(function(e){
    trackOutboundLink(this, e, 'Main Links', 'IT Help');
  });

  $('#farm .track-main').click(function(e){
    trackOutboundLink(this, e, 'Main Links', 'Software Farm');
  });

  $('#kundesenteret .track-main').click(function(e){
    trackOutboundLink(this, e, 'Main Links', 'Kundesenteret');
  });


  // CARD FLIPS
  // Track event when a card is flipped
  $('#itslearning .flip-open').click(function(){
    _gaq.push(['_trackEvent', 'Card Flips', 'Itslearning']);
  });

  $('#email .flip-open').click(function(){
    _gaq.push(['_trackEvent', 'Card Flips', 'Email']);
  });

  $('#schedule .flip-open').click(function(){
    _gaq.push(['_trackEvent', 'Card Flips' , 'Schedule']);
  });

  $('#studweb .flip-open').click(function(){
    _gaq.push(['_trackEvent', 'Card Flips', 'StudentWeb']);
  });

  $('#dinner .flip-open').click(function(){
    _gaq.push(['_trackEvent', 'Card Flips', 'SIT Dinner']);
  });

  $('#map .flip-open').click(function(){
    _gaq.push(['_trackEvent', 'Card Flips', 'Campus Map']);
  });

  $('#filesender .flip-open').click(function(){
    _gaq.push(['_trackEvent', 'Card Flips', 'FileSender']);
  });

  $('#grades .flip-open').click(function(){
    _gaq.push(['_trackEvent', 'Card Flips', 'Grade Statistics']);
  });

  $('#romres .flip-open').click(function(){
    _gaq.push(['_trackEvent', 'Card Flips', 'Room Reservation']);
  });

  $('#it-hjelp .flip-open').click(function(){
    _gaq.push(['_trackEvent', 'Card Flips', 'IT Help']);
  });

  $('#farm .flip-open').click(function(){
    _gaq.push(['_trackEvent', 'Card Flips', 'Software Farm']);
  });

  $('#kundesenteret .flip-open').click(function(){
    _gaq.push(['_trackEvent', 'Card Flips', 'Kundesenteret']);
  });


  // MODAL
  // Contains events related to the information modal
  $('#about-button').click(function(){
    _gaq.push(['_trackEvent', 'Modal', 'Show Modal']);
  });

  $('#track-email').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Send Email to Instabart');
  });

  $('#track-twitter').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Follow on Twitter');
  });

  $('#track-github').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Fork on Github');
  });

  $('#notifier').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Online Notifier');
  });

  $('#bartebuss').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Bartebuss');
  });

  $('#track-jquery').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'jQuery (built with)');
  });

  $('#track-modernizr').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Modernizr (built with)');
  });

  $('#track-sass').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Sass (built with)');
  });

  $('#track-entypo').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Entypo (built with)');
  });

  $('#track-leanmodal').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Lean Modal (built with)');
  });

  $('#track-angular').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Angular JS (built with)');
  });

  $('#track-normalize').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Normalize (built with)');
  });

  $('#track-icomoon').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Icomoon (built with)');
  });

  $('#track-glyphicons').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Glyphicons (built with)');
  });

  $('#track-vb').click(function(e){
    trackOutboundLink(this, e, 'Modal', 'Visual Basic (built with)');
  });


  // SCHEDULE SETTINGS
  // Events related to remembering the users schedule
  $('#schedule-yes-button').click(function(e){
    if (schedule_input_is_valid()){
      _gaq.push(['_trackEvent', 'Schedule Settings', 'Yes (remember schedule)']);
    }
  });

  $('#schedule-no-button').click(function(e){
    _gaq.push(['_trackEvent', 'Schedule Settings', "No (don't remember schedule)"]);
  });

  $('#schedule .track-main').click(function(e){
    if (supportsLocalStorage()){
      if (!hasClickedScheduleBefore()){
        _gaq.push(['_trackEvent', 'Schedule Settings', 'Show Settings (first time)']);
      }
    }
  });

  $('#schedule-settings-button').click(function(e){
    if (hasClickedScheduleBefore()){
      _gaq.push(['_trackEvent', 'Schedule Settings', 'Show Settings']);
    }
    else {
      _gaq.push(['_trackEvent', 'Schedule Settings', 'Show Settings (first time)']);
    }
  });

  // OTHER LINKS
  // Links that doesn't fit into the other categories
  $('#track-mvn').click(function(e){
    trackOutboundLink(this, e, 'Other Links', 'mvn.no');
  });

  $('#track-farm-extra').click(function(e){
    trackOutboundLink(this, e, 'Other Links', 'https://innsida.ntnu.no/wiki/-/wiki/Norsk/Programfarm');
  });

  $('#track-romres-extra').click(function(e){
    trackOutboundLink(this, e, 'Other Links', 'http://www.ntnu.no/studieinformasjon/rom/');
  });

  $('#track-email-extra').click(function(e){
    trackOutboundLink(this, e, 'Other Links', 'https://innsida.ntnu.no/wiki/-/wiki/Norsk/Slik+bruker+du+webmail#section-Slik+bruker+du+webmail-Videresende+epost+til+andre+kontoer');
  });
});