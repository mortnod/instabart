$(document).ready(function(){
  // Use this function when tracking external links
  function trackOutboundLink(link, category, action) {
    try {
    _gaq.push(['_trackEvent', category , action]);
    } catch(err){}
    
    // Small timeout to ensure that the event is tracked
    // before following the link
    setTimeout(function() {
      document.location.href = link.href;
    }, 100);
  }

  // MAIN LINKS
  // Event tracking for the main links
  $('#itslearning .track-main').click(function(){
    trackOutboundLink(this, 'Main Links', 'Itslearning'); return false;
  });

  $('#email .track-main').click(function(){
    trackOutboundLink(this, 'Main Links', 'Email'); return false;
  });

  $('#schedule .track-main').click(function(){
    trackOutboundLink(this, 'Main Links', 'Schedule'); return false;
  });

  $('#studweb .track-main').click(function(){
    trackOutboundLink(this, 'Main Links', 'StudentWeb'); return false;
  });

  $('#dinner .track-main').click(function(){
    trackOutboundLink(this, 'Main Links', 'SIT Dinner'); return false;
  });

  $('#map .track-main').click(function(){
    trackOutboundLink(this, 'Main Links', 'Campus Map'); return false;
  });

  $('#filesender .track-main').click(function(){
    trackOutboundLink(this, 'Main Links', 'FileSender'); return false;
  });

  $('#grades .track-main').click(function(){
    trackOutboundLink(this, 'Main Links', 'Grade Statistics'); return false;
  });

  $('#romres .track-main').click(function(){
    trackOutboundLink(this, 'Main Links', 'Room Reservation'); return false;
  });

  $('#it-hjelp .track-main').click(function(){
    trackOutboundLink(this, 'Main Links', 'IT Help'); return false;
  });

  $('#farm .track-main').click(function(){
    trackOutboundLink(this, 'Main Links', 'Software Farm'); return false;
  });

  $('#kundesenteret .track-main').click(function(){
    trackOutboundLink(this, 'Main Links', 'Kundesenteret'); return false;
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

  $('#track-email').click(function(){
    trackOutboundLink(this, 'Modal', 'Send Email to Instabart'); return false;
  });

  $('#track-twitter').click(function(){
    trackOutboundLink(this, 'Modal', 'Follow on Twitter'); return false;
  });

  $('#track-github').click(function(){
    trackOutboundLink(this, 'Modal', 'Fork on Github'); return false;
  });

  $('#notifier').click(function(){
    trackOutboundLink(this, 'Modal', 'Online Notifier'); return false;
  });

  $('#bartebuss').click(function(){
    trackOutboundLink(this, 'Modal', 'Bartebuss'); return false;
  });

  $('#track-jquery').click(function(){
    trackOutboundLink(this, 'Modal', 'jQuery (built with)'); return false;
  });

  $('#track-modernizr').click(function(){
    trackOutboundLink(this, 'Modal', 'Modernizr (built with)'); return false;
  });

  $('#track-sass').click(function(){
    trackOutboundLink(this, 'Modal', 'Sass (built with)'); return false;
  });

  $('#track-entypo').click(function(){
    trackOutboundLink(this, 'Modal', 'Entypo (built with)'); return false;
  });

  $('#track-leanmodal').click(function(){
    trackOutboundLink(this, 'Modal', 'Lean Modal (built with)'); return false;
  });

  $('#track-angular').click(function(){
    trackOutboundLink(this, 'Modal', 'Angular JS (built with)'); return false;
  });

  $('#track-normalize').click(function(){
    trackOutboundLink(this, 'Modal', 'Normalize (built with)'); return false;
  });

  $('#track-icomoon').click(function(){
    trackOutboundLink(this, 'Modal', 'Icomoon (built with)'); return false;
  });

  $('#track-glyphicons').click(function(){
    trackOutboundLink(this, 'Modal', 'Glyphicons (built with)'); return false;
  });

  $('#track-vb').click(function(){
    trackOutboundLink(this, 'Modal', 'Visual Basic (built with)'); return false;
  });


  // OTHER LINKS
  // Links that doesn't fit into the other categories
  $('#track-mvn').click(function(){
    trackOutboundLink(this, 'Other Links', 'mvn.no'); return false;
  });

  $('#track-farm-extra').click(function(){
    trackOutboundLink(this, 'Other Links', 'https://innsida.ntnu.no/wiki/-/wiki/Norsk/Programfarm'); return false;
  });

  $('#track-romres-extra').click(function(){
    trackOutboundLink(this, 'Other Links', 'http://www.ntnu.no/studieinformasjon/rom/'); return false;
  });

  $('#track-email-extra').click(function(){
    trackOutboundLink(this, 'Other Links', 'https://innsida.ntnu.no/wiki/-/wiki/Norsk/Slik+bruker+du+webmail#section-Slik+bruker+du+webmail-Videresende+epost+til+andre+kontoer'); return false;
  });
});