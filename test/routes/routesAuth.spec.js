const axios = require('axios');

const { leveErreur } = require('./utils');
const serveurTest = require('./serveurTest');

describe('Le serveur des routes `/auth`', () => {
  const serveur = serveurTest();
  let port;

  beforeEach((suite) => serveur.initialise(() => {
    port = serveur.port();
    suite();
  }));

  afterEach((suite) => serveur.arrete(suite));

  describe('sur GET /auth/cles_publiques', () => {
    it('retourne les clés de chiffrement au format JSON Web Key Set', () => {
      serveur.adaptateurEnvironnement().clePriveeJWK = () => ({ e: 'AQAB', n: '503as-2qay5...', kty: 'RSA' });
      serveur.adaptateurChiffrement().cleHachage = (chaine) => `hash de ${chaine}`;

      return axios.get(`http://localhost:${port}/auth/cles_publiques`)
        .then((reponse) => {
          expect(reponse.status).toEqual(200);
          expect(reponse.data).toEqual({
            keys: [{
              kid: 'hash de 503as-2qay5...',
              kty: 'RSA',
              use: 'enc',
              e: 'AQAB',
              n: '503as-2qay5...',
            }],
          });
        })
        .catch(leveErreur);
    });
  });

  describe('sur GET /auth/fcplus/connexion', () => {
    describe('lorsque les paramètres `code` et `state` sont présents', () => {
      it('sert les infos de la session FC+', () => {
        serveur.fabriqueSessionFCPlus().nouvelleSession = (code) => {
          try {
            expect(code).toBe('unCode');
            return Promise.resolve({
              enJSON: () => Promise.resolve({ infos: 'des infos' }),
            });
          } catch (e) {
            return Promise.reject(e);
          }
        };

        return axios.get(`http://localhost:${port}/auth/fcplus/connexion?state=unState&code=unCode`)
          .then((reponse) => {
            expect(reponse.status).toBe(200);
            expect(reponse.data).toEqual({ infos: 'des infos' });
          })
          .catch(leveErreur);
      });

      it('stocke les infos dans un cookie sans attribut `Secure` si autorisé', () => {
        serveur.adaptateurEnvironnement().avecEnvoiCookieSurHTTP = () => true;
        return axios.get(`http://localhost:${port}/auth/fcplus/connexion?state=unState&code=unCode`)
          .then((reponse) => {
            expect(reponse.headers).toHaveProperty('set-cookie');
            const valeurEnteteSetCookie = reponse
              .headers['set-cookie']
              .find((h) => h.match(/jeton=/));
            expect(valeurEnteteSetCookie).not.toContain('secure');
          })
          .catch(leveErreur);
      });

      it("sert une erreur HTTP 502 (Bad Gateway) quand l'authentification échoue", () => {
        expect.assertions(2);

        serveur.fabriqueSessionFCPlus().nouvelleSession = () => Promise.resolve({
          enJSON: () => Promise.reject(new Error('Oups')),
        });

        return axios.get(`http://localhost:${port}/auth/fcplus/connexion?code=unCode&state=unState`)
          .catch(({ response }) => {
            expect(response.status).toBe(502);
            expect(response.data).toEqual({ erreur: 'Échec authentification (Oups)' });
          });
      });
    });

    it("sert une erreur HTTP 400 (Bad Request) si le paramètre 'code' est manquant", () => {
      expect.assertions(2);

      return axios.get(`http://localhost:${port}/auth/fcplus/connexion?state=unState`)
        .catch(({ response }) => {
          expect(response.status).toBe(400);
          expect(response.data).toEqual({ erreur: "Paramètre 'code' absent de la requête" });
        });
    });

    it("sert une erreur HTTP 400 (Bad Request) si le paramètre 'state' est manquant", () => {
      expect.assertions(2);

      return axios.get(`http://localhost:${port}/auth/fcplus/connexion?code=unCode`)
        .catch(({ response }) => {
          expect(response.status).toBe(400);
          expect(response.data).toEqual({ erreur: "Paramètre 'state' absent de la requête" });
        });
    });
  });

  describe('sur GET /auth/fcplus/deconnexion', () => {
    it('redirige vers page accueil', () => (
      axios.get(`http://localhost:${port}/auth/fcplus/deconnexion`)
        .then((reponse) => expect(reponse.request.path).toBe('/'))
        .catch(leveErreur)
    ));
  });

  describe('sur GET /auth/fcplus/destructionSession', () => {
    it("appelle le middleware pour renseigner les infos de l'utilisateur courant", () => {
      serveur.middleware().reinitialise({
        utilisateurCourant: { given_name: '', family_name: '', jwtSessionFCPlus: 'abcdef' },
      });

      serveur.adaptateurFranceConnectPlus().urlDestructionSession = () => Promise.resolve(`http://localhost:${port}`);

      return axios.get(`http://localhost:${port}/auth/fcplus/destructionSession`)
        .then((reponse) => expect(reponse.request.path).toContain('id_token_hint=abcdef'))
        .catch(leveErreur);
    });
  });
});
