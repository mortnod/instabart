(function() {

  Card.init();
  Schedule.init();
  Analytics.init();

  function randomTagline(taglines){
    var random_id = Math.floor(Math.random()*taglines.length);
    return taglines[random_id];
  }

  // Create tagline from template
  template = Handlebars.templates['tagline'];
  var random_tagline = randomTagline(data.taglines);
  html = template(random_tagline);
  $('#tagline').append(html);

  // Displays the modal when the question button is clicked
  $('#about-button').leanModal({ top : 0, overlay: 0.7, closeButton: ".modal_close" });
})();