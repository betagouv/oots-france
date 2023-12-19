const pieceJustificative = require('../../src/api/pieceJustificative');
const {
  ErreurAbsenceReponseDestinataire,
  ErreurReponseRequete,
  ErreurDestinataireInexistant,
} = require('../../src/erreurs');

describe('Le requêteur de pièce justificative', () => {
  const adaptateurUUID = {};
  const adaptateurDomibus = {};
  const requete = {};
  const reponse = {};

  beforeEach(() => {
    adaptateurUUID.genereUUID = () => '';
    adaptateurDomibus.envoieMessageRequete = () => Promise.resolve();
    adaptateurDomibus.pieceJustificativeDepuisReponse = () => Promise.resolve();
    adaptateurDomibus.urlRedirectionDepuisReponse = () => Promise.resolve();
    adaptateurDomibus.verifieDestinataireExiste = () => Promise.resolve();

    requete.query = {};
    reponse.send = () => Promise.resolve();
    reponse.status = () => reponse;
    reponse.redirect = () => Promise.resolve();
  });

  it('envoie un message AS4 au bon destinataire', (suite) => {
    requete.query.destinataire = 'UN_DESTINATAIRE';

    adaptateurDomibus.envoieMessageRequete = (destinataire) => {
      try {
        expect(destinataire).toEqual('UN_DESTINATAIRE');
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };

    pieceJustificative(adaptateurDomibus, adaptateurUUID, requete, reponse)
      .then(() => suite())
      .catch(suite);
  });

  it('utilise un identifiant de conversation', (suite) => {
    adaptateurUUID.genereUUID = () => '11111111-1111-1111-1111-111111111111';

    adaptateurDomibus.envoieMessageRequete = (_destinataire, idConversation) => {
      try {
        expect(idConversation).toEqual('11111111-1111-1111-1111-111111111111');
        return Promise.resolve();
      } catch (e) { return Promise.reject(e); }
    };

    adaptateurDomibus.urlRedirectionDepuisReponse = (idConversation) => {
      try {
        expect(idConversation).toEqual('11111111-1111-1111-1111-111111111111');
        return Promise.resolve();
      } catch (e) { return Promise.reject(e); }
    };

    pieceJustificative(adaptateurDomibus, adaptateurUUID, requete, reponse)
      .then(() => suite())
      .catch(suite);
  });

  describe('quand `process.env.URL_OOTS_FRANCE` vaut `https://localhost:1234`', () => {
    let urlOotsFrance;

    beforeEach(() => {
      urlOotsFrance = process.env.URL_OOTS_FRANCE;
    });

    afterEach(() => {
      process.env.URL_OOTS_FRANCE = urlOotsFrance;
    });

    it("construis l'URL de redirection", (suite) => {
      adaptateurDomibus.urlRedirectionDepuisReponse = () => Promise.resolve('https://example.com');
      process.env.URL_OOTS_FRANCE = 'http://localhost:1234';

      reponse.redirect = (urlRedirection) => {
        try {
          expect(urlRedirection).toEqual('https://example.com?returnurl=http://localhost:1234');
          return Promise.resolve();
        } catch (e) { return Promise.reject(e); }
      };

      pieceJustificative(adaptateurDomibus, adaptateurUUID, requete, reponse)
        .then(() => suite())
        .catch(suite);
    });
  });

  it('accepte de recevoir directement la pièce justificative', (suite) => {
    let pieceJustificativeRecue = false;
    adaptateurDomibus.urlRedirectionDepuisReponse = () => Promise.reject(new ErreurAbsenceReponseDestinataire('aucune URL de redirection reçue'));
    adaptateurDomibus.pieceJustificativeDepuisReponse = () => {
      pieceJustificativeRecue = true;
      return Promise.resolve();
    };

    pieceJustificative(adaptateurDomibus, adaptateurUUID, requete, reponse)
      .then(() => expect(pieceJustificativeRecue).toBe(true))
      .then(() => suite())
      .catch(suite);
  });

  it("génère une erreur HTTP 502 (Bad Gateway) sur réception d'une réponse en erreur", (suite) => {
    adaptateurDomibus.urlRedirectionDepuisReponse = () => Promise.reject(new ErreurReponseRequete('object not found'));
    adaptateurDomibus.pieceJustificativeDepuisReponse = () => Promise.reject(new ErreurAbsenceReponseDestinataire('aucun justificatif reçu'));

    reponse.status = (codeStatus) => {
      expect(codeStatus).toEqual(502);
      return reponse;
    };

    reponse.send = (contenu) => {
      expect(contenu).toEqual('object not found ; aucun justificatif reçu');
    };

    pieceJustificative(adaptateurDomibus, adaptateurUUID, requete, reponse)
      .then(() => suite())
      .catch(suite);
  });

  it("génère une erreur 422 lorsque le destinataire n'existe pas", (suite) => {
    requete.query.destinataire = 'DESTINATAIRE_INEXISTANT';
    adaptateurDomibus.verifieDestinataireExiste = (dest) => Promise.reject(new ErreurDestinataireInexistant(`Le Destinataire n'existe pas : ${dest}`));

    reponse.status = (codeStatus) => {
      expect(codeStatus).toEqual(422);
      return reponse;
    };
    reponse.send = (contenu) => {
      expect(contenu).toEqual('Le Destinataire n\'existe pas : DESTINATAIRE_INEXISTANT');
    };

    pieceJustificative(adaptateurDomibus, adaptateurUUID, requete, reponse)
      .then(() => suite())
      .catch(suite);
  });
});
