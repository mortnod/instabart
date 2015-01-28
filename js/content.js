var data = {
  cards: [
    {
      title:'Itslearning',
      pictogram:'itslearning',
      css_id:'itslearning',
      link:'https://sats.itea.ntnu.no/sso-wrapper/web/wrapper?target=itslearning',
      description: 'Kanskje den viktigste siden i hverdagen - forelesningsfoiler, øvings-oppgaver og beskjeder fra foreleserne legges her.'
    }, {
      title:'Epost',
      pictogram:'email',
      css_id:'email',
      link:'https://webmail.stud.ntnu.no/',
      description:'Det forventes at du sjekker NTNU-mailen din jevnlig. Et tips er å videresende disse epostene til din private epostadresse - les hvordan <a href="https://innsida.ntnu.no/wiki/-/wiki/Norsk/Slik+bruker+du+webmail#section-Slik+bruker+du+webmail-Videresende+epost+til+andre+kontoer" id="track-email-extra">her</a>.'
    }, {
      title:'Timeplan',
      pictogram:'schedule',
      css_id:'schedule',
      link:'http://ntnu.1024.no/',
      description:'Denne kjekke tjenesten lager timeplanen din for deg, hvis du forteller den hvilke   emner du tar. Bruk gjerne NTNU brukernavnet ditt.'
    }, {
      title:'Office 365',
      pictogram:'office',
      css_id:'office',
      link:'http://innsida.ntnu.no/o365',
      description:'Beskrivelse legges til senere'
    }, {
      title:'Studweb',
      pictogram:'studweb',
      css_id:'studweb',
      link:'https://idp.feide.no/simplesaml/saml2/idp/SSOService.php?SAMLRequest=fVJNj5swEL33VyD3DAbSSisrsEo3WjXSbhMtbCv1ZswATozt2iZs%2F30NJFJ6yYWDeW9m3sf68aMXwRmM5UpmKIliFIBkquayzdB7%2BRw%2BoMf809rSXmiyGVwn3%2BDPANYFG2vBOE97UtIOPZgCzJkzeH97yVDnnLYEY%2BuGGqQboYqkk0MkFWYtDysu8S%2Bo9tURmLM3qDQaFcUjxQ3wGl6V4RQFW7%2BOS%2BrmE6%2BTea2jGTTNtLzXAqYj8fRJp7%2B4KPaXkyLdaRTsthkSDISoNKvVSVPa1ae%2BaTToY9f10Ctoa6qOoj01Hm3tADtpHZUuQ2mcrML4a5g%2BlGlCkpTEq98oOBjlFFPiG5eLYYORRFHLLZG0B0scI8Xm9YWkUUyqBWTJ97I8hId9Uc4Dzl6C%2BeHRGbqVhIKf11DSKRQfk7RkEnd%2FC72mckvR9zn6IuNK%2BfANWIz2Po%2FjGI2rSJkWp3Gc4PgL9iiP%2BIzyuRZkdsrk04aeMiBXCcQu7vuVakmfO6DRFLZPeo1vyZeCTT7stgclOPsbbIRQ45MB6rw3zgyAgmdleuruq5leeB02M5Q4Q6XlvlwI58vK%2F2uc%2FwM%3D&RelayState=NTNU%26fnromgjor%3D',
      description:'Meld deg på (og av) emner, godkjenn studieplan, betal semesteravgift, og finn ut hvor hardt du failet på eksamen.'
    }, {
      title:'Middag',
      pictogram:'dinner',
      css_id:'dinner',
      link:'https://www.sit.no/middag',
      description:'Hva disker din lokale SIT-kantine opp med i dag?'
    }, {
      title:'Campuskart',
      pictogram:'map',
      css_id:'map',
      link:'http://use.mazemap.com/',
      description:'Hjelp, hvor er datasalen Sprokkit? Hva er dette «Kjelhuset» alle snakker om? MazeMap  viser vei! <br>(…på Gløshaugen / St. Olav)'
    }, {
      title:'Trening',
      pictogram:'training',
      css_id:'training',
      link:'https://www.sit.no/trening/gruppe',
      description:'Meld deg på SITs mange gruppetimer her. Påmelding åpner kl 21:00 to dager før timene. Akkurat nok tid til å gro en tredagersstubb'
    }, {
      title:'Romres',
      pictogram:'romres',
      css_id:'romres',
      link:'https://romres.ntnu.no/',
      description:'Reservér grupperom og auditorier et halvt år i forveien. Timeplaner for enkeltrom   finner du <a href="http://www.ntnu.no/studieinformasjon/rom/" id="track-romres-extra">her</a>.'
    }, {
      title:'Programvare',
      pictogram:'software',
      css_id:'software',
      link:'https://software.ntnu.no',
      description:'Mange programmer er gratis tilgjengelig for NTNU-studenter. Trenger du Matlab, for eksempel? Endnote? Clue?'
    }, {
      title:'Farm',
      pictogram:'farm',
      css_id:'farm',
      link:'https://farm.ntnu.no/',
      description:'Savner du Word? Farm gir deg tilgang til programmene, filene og nettsidene du ville hatt på en datasal. Kort innføring finner du <a href="https://innsida.ntnu.no/wiki/-/wiki/Norsk/Programfarm" id="track-farm-extra">her</a>.'
    }, {
      title:'Forelesninger',
      pictogram:'film',
      css_id:'film',
      link:'https://video.adm.ntnu.no/',
      description:'NTNU filmer en del forelesninger. Hør med <a href="www.ntnu.no/mms">Multimediesenteret</a> (og foreleser) om filming av dine favorittforelesninger!'
    }
  ],

  taglines: [
    // @if ENV='web'
    {
      tagline: 'Har du mobil? Er den smart? Last ned appen til <a href="https://itunes.apple.com/no/app/instabart/id903592925?mt=8" id="track-ios">iOS</a> og <a href="https://play.google.com/store/apps/details?id=com.mvn.instabart" id="track-android">Android</a>!'
    },
    // @endif
    {
      tagline: "Kjekke NTNU-tjenester. Umiddel<strong>bart</strong>."
    }, {
      tagline: "Favoritt blant bartebyens studenter siden 1917!"
    }, {
      tagline: "Hele NTNU samlet under én bart!"
    }, {
      tagline: "Dekker alle dine behov som NTNU-student... bortsett fra kaffe"
    }, {
      tagline: "La barten bane vei i NTNUs frodige IT-jungel!"
    }, {
      tagline: "NTNUs IT-tjenester? Gotta know 'em all!"
    }
  ]
};