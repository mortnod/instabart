var CardCtrl = ['$scope', function($scope) { /* Complicated constructor to survive minification carnage */ 
  var itslearning = {
    'title':'Itslearning',
    'description':'Ditt interfjes mot alle* emnene du tar ved NTNU - forelesningsfoiler, øvingsoppgaver, beskjeder, den type ting.  *I teorien iallefall.',
    'link':'https://sats.itea.ntnu.no/sso-wrapper/web/wrapper?target=itslearning',
    'pictogram':'itslearning',
    'css_id':'itslearning'
  };

  var email = {
    'title':'Epost',
    'description':'NTNU-mailkontoen din bør du sjekke jevnlig. Mange foretrekker å videresende fra denne til egen mailadresse - les hvordan <a href="https://innsida.ntnu.no/wiki/-/wiki/Norsk/Slik+bruker+du+webmail#section-Slik+bruker+du+webmail-Videresende+epost+til+en+annen+konto">her</a>.',
    'link':'https://webmail.stud.ntnu.no/',
    'pictogram':'email',
    'css_id':'email'
  };

  var schedule = {
    'title':'Timeplan',
    'description':'Denne kjekke tjenesten lager timeplanen din for deg, hvis du forteller den hvilke emner du tar. Bruk gjerne NTNU-brukernavnet ditt.',
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
    'description':'Hjelp, hvor er datasalen Sprokkit? Hva er dette «kjelhuset» alle snakker om? Campusguiden viser vei! (...på Gløshaugen)',
    'link':'http://app.campusguiden.no/',
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
    'description':'Mektigere karakterstatistikk enn du finner på Studweb. Hvilke av emnene du tar i år er typiske stryk-emner? Og slo dere jentene i år?',
    'link':'https://innsida.ntnu.no/sso/?target=KarstatProd',
    'pictogram':'grades',
    'css_id':'grades'
  };

  var romres = {
    'title':'Romres',
    'description':'Reservér grupperom og auditorier et halvt år i forveien. Timeplaner for enkeltrom finner du <a href="http://www.ntnu.no/studieinformasjon/rom/">her</a>.',
    'link':'http://www.ntnu.no/studieinformasjon/rom/',
    'pictogram':'romres',
    'css_id':'romres'
  };

  var ithjelp = {
    'title':'IT-hjelp',
    'description':'Hvordan koble telefonen automatisk til eduroam? NTNUs IT-hjelp løser alle dine problemer, og et par du ikke visste du hadde.',
    'link':'https://innsida.ntnu.no/it-hjelp',
    'pictogram':'it-help',
    'css_id':'it-hjelp'
  };

  var farm = {
    'title':'Farm',
    'description':'Savner du Word? Farm gir deg tilgang til programmer, filer og nettsider du ville hatt på en datasal. Domenet er "win-ntnu-no\brukernavn"',
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

var ModalCtrl = ['$scope', function($scope) { /* Complicated constructor to survive minification carnage */ 
  var about = {
    'title':'Hæ? Hva i alle dager er Instabart?',
    'text':'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, eveniet, a, sapiente illum error quos quas esse quibusdam officia dolor quasi aut magnam tempora. Recusandae expedita deleniti deserunt voluptatibus dolor.',
    'pictogram':'pow'
  };

  var contact = {
    'title':'Snakk med oss!',
    'text':'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, eveniet, a, sapiente illum error quos quas esse quibusdam officia dolor quasi aut magnam tempora. Recusandae expedita deleniti deserunt voluptatibus dolor.',
    'pictogram':'bug'
  };

  var otherServices = {
    'title':'Andre sexy tjenester',
    'text':'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, eveniet, a, sapiente illum error quos quas esse quibusdam officia dolor quasi aut magnam tempora. Recusandae expedita deleniti deserunt voluptatibus dolor.',
    'pictogram':'fire'
  };

  var licensing = {
    'title':'Lisensiering',
    'text':'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, eveniet, a, sapiente illum error quos quas esse quibusdam officia dolor quasi aut magnam tempora. Recusandae expedita deleniti deserunt voluptatibus dolor.',
    'pictogram':'briefcase'
  };

  $scope.modalSections = [about, contact, otherServices, licensing];
}];