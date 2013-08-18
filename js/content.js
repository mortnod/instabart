// Card controller
var CardCtrl = ['$scope', function($scope) { /* Complicated constructor to survive minification carnage */
  var itslearning = {
    'title':'Itslearning',
    'description':'Kanskje den viktigste siden i hverdagen - forelesningsfoiler, øvings-oppgaver og beskjeder fra foreleserne legges her.',
    'link':'https://sats.itea.ntnu.no/sso-wrapper/web/wrapper?target=itslearning',
    'pictogram':'itslearning',
    'css_id':'itslearning'
  };

  var email = {
    'title':'Epost',
    'description':'Det forventes at du sjekker NTNU-mailen din jevnlig. Et tips er å videresende disse epostene til din private epostadresse - les hvordan <a href="https://innsida.ntnu.no/wiki/-/wiki/Norsk/Slik+bruker+du+webmail#section-Slik+bruker+du+webmail-Videresende+epost+til+andre+kontoer" id="track-email-extra">her</a>.',
    'link':'https://webmail.stud.ntnu.no/',
    'pictogram':'email',
    'css_id':'email'
  };

  var schedule = {
    'title':'Timeplan',
    'description':'Denne kjekke tjenesten lager timeplanen din for deg, hvis du forteller den hvilke emner du tar. Bruk gjerne NTNU brukernavnet ditt.',
    'link':'http://ntnu.1024.no/',
    'pictogram':'schedule',
    'css_id':'schedule'
  };

  var studweb = {
    'title':'Studweb',
    'description':'Meld deg på (og av) emner, godkjenn studieplan, betal semesteravgift, og finn ut hvor hardt du failet på eksamen.',
    'link':'https://idp.feide.no/simplesaml/saml2/idp/SSOService.php?SAMLRequest=fVJNj5swEL33VyD3DAbSSisrsEo3WjXSbhMtbCv1ZswATozt2iZs%2F30NJFJ6yYWDeW9m3sf68aMXwRmM5UpmKIliFIBkquayzdB7%2BRw%2BoMf809rSXmiyGVwn3%2BDPANYFG2vBOE97UtIOPZgCzJkzeH97yVDnnLYEY%2BuGGqQboYqkk0MkFWYtDysu8S%2Bo9tURmLM3qDQaFcUjxQ3wGl6V4RQFW7%2BOS%2BrmE6%2BTea2jGTTNtLzXAqYj8fRJp7%2B4KPaXkyLdaRTsthkSDISoNKvVSVPa1ae%2BaTToY9f10Ctoa6qOoj01Hm3tADtpHZUuQ2mcrML4a5g%2BlGlCkpTEq98oOBjlFFPiG5eLYYORRFHLLZG0B0scI8Xm9YWkUUyqBWTJ97I8hId9Uc4Dzl6C%2BeHRGbqVhIKf11DSKRQfk7RkEnd%2FC72mckvR9zn6IuNK%2BfANWIz2Po%2FjGI2rSJkWp3Gc4PgL9iiP%2BIzyuRZkdsrk04aeMiBXCcQu7vuVakmfO6DRFLZPeo1vyZeCTT7stgclOPsbbIRQ45MB6rw3zgyAgmdleuruq5leeB02M5Q4Q6XlvlwI58vK%2F2uc%2FwM%3D&RelayState=NTNU%26fnromgjor%3D',
    'pictogram':'studweb',
    'css_id':'studweb'
  };

  var dinner = {
    'title':'Middag',
    'description':'Hva disker din lokale SIT-kantine opp med i dag?',
    'link':'https://www.sit.no/middag',
    'pictogram':'dinner',
    'css_id':'dinner'
  };

  var map = {
    'title':'Campuskart',
    'description':'Hjelp, hvor er datasalen Sprokkit? Hva er dette «Kjelhuset» alle snakker om? MazeMap viser vei! <br>(…på Gløshaugen / St. Olav)',
    'link':'http://use.mazemap.com/',
    'pictogram':'map',
    'css_id':'map'
  };

  var cloudstor = {
    'title':'CloudStor',
    'description':'Trenger du å sende en diger fil til noen? Når mailbokser og minnepinner kneler, kommer CloudStor til unnsetning!',
    'link':'https://cloudstor.uninett.no/simplesaml/module.php/core/as_login.php?AuthId=default-sp&ReturnTo=https://cloudstor.uninett.no/index.php?s=upload',
    'pictogram':'cloudstor',
    'css_id':'cloudstor'
  };

  var grades = {
    'title':'Karakterer',
    'description':'Karakterstatistikk for flere år bakover. Hvilke av emnene du tar i år er typiske stryk-emner?',
    'link':'https://innsida.ntnu.no/sso/?target=KarstatProd',
    'pictogram':'grades',
    'css_id':'grades'
  };

  var romres = {
    'title':'Romres',
    'description':'Reservér grupperom og auditorier et halvt år i forveien. Timeplaner for enkeltrom finner du <a href="http://www.ntnu.no/studieinformasjon/rom/" id="track-romres-extra">her</a>.',
    'link':'https://romres.ntnu.no/',
    'pictogram':'romres',
    'css_id':'romres'
  };

  var ithjelp = {
    'title':'IT-hjelp',
    'description':'Hvordan koble telefonen automatisk til eduroam? Hvordan bruke printerne på campus? NTNUs IT-hjelp løser dine problemer!',
    'link':'https://innsida.ntnu.no/it-hjelp',
    'pictogram':'it-help',
    'css_id':'it-hjelp'
  };

  var farm = {
    'title':'Farm',
    'description':'Savner du Word? Farm gir deg tilgang til programmene, filene og nettsidene du ville hatt på en datasal. Kort innføring finner du <a href="https://innsida.ntnu.no/wiki/-/wiki/Norsk/Programfarm" id="track-farm-extra">her</a>.',
    'link':'https://farm.ntnu.no/',
    'pictogram':'farm',
    'css_id':'farm'
  };

  var kundesenteret = {
    'title':'Grupper',
    'description':'Lag dine egne epostlister, og opprett grupper for dine NTNU-prosjekter, der du kan dele filer med andre.',
    'link':'https://innsida.ntnu.no/sso/?target=studdrift_groups',
    'pictogram':'kundesenteret',
    'css_id':'kundesenteret'
  };

  $scope.cards = [itslearning, email, schedule, studweb, dinner, map, cloudstor, grades, romres, ithjelp, farm, kundesenteret];
}];

// Tagline controller
var TaglineCtrl = ['$scope', function($scope) { /* Complicated constructor to survive minification carnage */
  var taglines = [
    "Kjekke NTNU-tjenester. Umiddel<strong>bart</strong>.",
    "Favoritt blant bartebyens studenter siden 1917!",
    "Hele NTNU samlet under én bart!",
    "Dekker alle dine behov som NTNU-student... bortsett fra kaffe",
    "La barten bane vei i NTNUs frodige IT-jungel!",
    "NTNUs IT-tjenester? Gotta know 'em all!"
    // "Forskning viser at NTNU-studenter flest bare vet om halvbarten av disse tjenestene"
  ];

  function randomTagline(taglines){
    var random_id = Math.floor(Math.random()*taglines.length);
    return taglines[random_id];
  }

  $scope.randomTagline = randomTagline(taglines);
}];