## Les choses à valider : 

1. la signature est validée
2. le nonce est le bon
3. le jeton est pas périmé
4. le at\_hash doit être le meme que la signature de l'access\_token
  ipour vérifier la compatibilité entre le at_hash du token_id et le access_token – utiliser la lib https://www.npmjs.com/package/oidc-token-hash
5. vérifier le destinataire (moi), le sub, l'expéditeur

l'algo est ES256

La lib kifétou : https://github.com/panva/node-openid-client

https://datatracker.ietf.org/doc/html/rfc7662

On reprend contact avec l'équipe France Connect le 18 mars.
