const cookieSession = require('cookie-session');
const express = require('express');

const connexionFCPlus = require('./api/connexionFCPlus');
const pieceJustificative = require('./api/pieceJustificative');
const EnteteErreur = require('./ebms/enteteErreur');
const EnteteRequete = require('./ebms/enteteRequete');
const PointAcces = require('./ebms/pointAcces');
const ReponseErreur = require('./ebms/reponseErreur');
const RequeteJustificatif = require('./ebms/requeteJustificatif');
const routesAdmin = require('./routes/routesAdmin');

const creeServeur = (config) => {
  const {
    adaptateurChiffrement,
    adaptateurDomibus,
    adaptateurEnvironnement,
    adaptateurFranceConnectPlus,
    adaptateurUUID,
    depotPointsAcces,
    ecouteurDomibus,
    horodateur,
  } = config;
  let serveur;
  const app = express();

  app.use(cookieSession({
    maxAge: 15 * 60 * 1000,
    name: 'jeton',
    sameSite: true,
    secret: adaptateurEnvironnement.secretJetonSession(),
    secure: adaptateurEnvironnement.avecEnvoiCookieSurHTTP(),
  }));

  app.use('/admin', routesAdmin({ ecouteurDomibus }));

  app.get('/auth/cles_publiques', (_requete, reponse) => {
    const { kty, n, e } = adaptateurEnvironnement.clePriveeJWK();
    const idClePublique = adaptateurChiffrement.cleHachage(n);

    const clePubliqueDansJWKSet = {
      keys: [{
        kid: idClePublique,
        use: 'enc',
        kty,
        e,
        n,
      }],
    };

    reponse.set('Content-Type', 'application/json');
    reponse.status(200)
      .send(clePubliqueDansJWKSet);
  });

  app.get('/auth/fcplus/connexion', (requete, reponse) => {
    const { code, state } = requete.query;
    if (typeof state === 'undefined' || state === '') {
      reponse.status(400).json({ erreur: "Paramètre 'state' absent de la requête" });
    } else if (typeof code === 'undefined' || code === '') {
      reponse.status(400).json({ erreur: "Paramètre 'code' absent de la requête" });
    } else {
      connexionFCPlus(
        { adaptateurChiffrement, adaptateurFranceConnectPlus },
        code,
        requete,
        reponse,
      );
    }
  });

  app.get('/ebms/entetes/requeteJustificatif', (requete, reponse) => {
    const { idDestinataire, typeIdentifiant } = requete.query;
    const destinataire = new PointAcces(idDestinataire, typeIdentifiant);
    const idConversation = adaptateurUUID.genereUUID();
    const suffixe = process.env.SUFFIXE_IDENTIFIANTS_DOMIBUS;
    const idPayload = `cid:${adaptateurUUID.genereUUID()}@${suffixe}`;
    const enteteEBMS = new EnteteRequete(
      { adaptateurUUID, horodateur },
      { destinataire, idConversation, idPayload },
    );

    reponse.set('Content-Type', 'text/xml');
    reponse.send(enteteEBMS.enXML());
  });

  app.get('/ebms/messages/requeteJustificatif', (_requete, reponse) => {
    const requeteJustificatif = new RequeteJustificatif({ adaptateurUUID, horodateur });

    reponse.set('Content-Type', 'text/xml');
    reponse.send(requeteJustificatif.corpsMessageEnXML());
  });

  app.get('/ebms/entetes/reponseErreur', (requete, reponse) => {
    const { destinataire } = requete.query;
    const idConversation = adaptateurUUID.genereUUID();
    const suffixe = process.env.SUFFIXE_IDENTIFIANTS_DOMIBUS;
    const idPayload = `cid:${adaptateurUUID.genereUUID()}@${suffixe}`;
    const enteteEBMS = new EnteteErreur(
      { adaptateurUUID, horodateur },
      { destinataire, idConversation, idPayload },
    );

    reponse.set('Content-Type', 'text/xml');
    reponse.send(enteteEBMS.enXML());
  });

  app.get('/ebms/messages/reponseErreur', (requete, reponse) => {
    const reponseErreur = new ReponseErreur({ adaptateurUUID, horodateur }, {
      idRequete: adaptateurUUID.genereUUID(),
      exception: {
        type: 'rs:ObjectNotFoundExceptionType',
        message: 'Object not found',
        severite: 'urn:oasis:names:tc:ebxml-regrep:ErrorSeverityType:Error',
        code: 'EDM:ERR:0004',
      },
    });
    reponse.set('Content-Type', 'text/xml');
    reponse.send(reponseErreur.corpsMessageEnXML());
  });

  app.get('/requete/pieceJustificative', (requete, reponse) => {
    if (adaptateurEnvironnement.avecRequetePieceJustificative()) {
      pieceJustificative({ adaptateurDomibus, adaptateurUUID, depotPointsAcces }, requete, reponse);
    } else {
      reponse.status(501).send('Not Implemented Yet!');
    }
  });

  app.get('/', (requete, reponse) => {
    adaptateurChiffrement.verifieJeton(requete.session.jeton)
      .then((jeton) => (jeton
        ? `Utilisateur courant : ${jeton.given_name} ${jeton.family_name}`
        : "Pas d'utilisateur courant"))
      .then((message) => reponse.send(message));
  });

  const arreteEcoute = (suite) => serveur.close(suite);

  const ecoute = (...args) => { serveur = app.listen(...args); };

  const port = () => serveur.address().port;

  return {
    arreteEcoute,
    ecoute,
    port,
  };
};

module.exports = { creeServeur };
