const requeteListeMessagesEnAttente = (idConversation) => {
  const filtreIdConversation = idConversation
    ? `<conversationId>${idConversation}</conversationId>`
    : '';

  return `
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:_1="http://eu.domibus.wsplugin/">
  <soap:Header/>
  <soap:Body>
    <_1:listPendingMessagesRequest>${filtreIdConversation}</_1:listPendingMessagesRequest>
  </soap:Body>
</soap:Envelope>
  `;
};

const requeteRecuperationMessage = (idMessage) => `
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:_1="http://eu.domibus.wsplugin/">
  <soap:Header/>
  <soap:Body>
    <_1:retrieveMessageRequest>
      <messageID>${idMessage}</messageID>
    </_1:retrieveMessageRequest>
  </soap:Body>
</soap:Envelope>
  `;

module.exports = {
  requeteListeMessagesEnAttente,
  requeteRecuperationMessage,
};
