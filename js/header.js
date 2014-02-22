var Header = {
  init: function() {
    this.createTagline();
    this.bindUIActions();
  },

  createTagline: function() {
    var template = Handlebars.templates['tagline'];
    var random_tagline = Header.randomTagline(data.taglines);
    var html = template(random_tagline);
    $('#tagline').append(html);
  },

  randomTagline: function(taglines) {
    var random_id = Math.floor(Math.random()*taglines.length);
    return taglines[random_id];
  },

  bindUIActions: function() {
    // Display modal when the question button is clicked
    $('#about-button').leanModal({ top : 0, overlay: 0.7, closeButton: ".modal_close" });
  }
};