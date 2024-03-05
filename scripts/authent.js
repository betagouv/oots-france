const clientId = 'xxx';
const clientSecret = `xxx';
const code = 'rTxX6a_H5skTvDQPyuQ13-haUdZsAT2biGKGo8OVrg8';
const redirectUri = 'https://preprod.ue.api.gouv.fr/auth/fcplus/connexion';
const axios = require('axios');

const requestToken = async (spConfig) => {
  // Retrieve the SP parameters
  const {
    clientId,
    clientSecret,
    code,
    redirectUri,
  } = spConfig;

  // Set request params
  const body = {
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
    code,
  };

  // Request access token.
  const data = new URLSearchParams(body).toString();
  return axios({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data,
    url: 'https://auth.integ01.dev-franceconnect.fr/api/v2/token',
  }).then((reponse) => reponse.data);
};

requestToken({
  clientId, clientSecret, code, redirectUri,
})
/**
.then(({ access_token }) => axios.get(
    'https://auth.integ01.dev-franceconnect.fr/api/v2/userinfo',
    { headers: { Authorization: `Bearer ${access_token}` } },
  ))
  .then(({ data }) => console.log(data));
*/
// const token = {
//   access_token: 'kE94qsfPdivNJg1k_j3YYubXNebbyvy-vDq3INqUpMq',
//   expires_in: 60,
//   id_token: 'eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00iLCJjdHkiOiJKV1QiLCJraWQiOiJiNmM1MzUwYS0wMDUwLTQ4N2EtYTkwNS05NTFkMjNjYjE4ZjYiLCJpc3MiOiJodHRwczovL2F1dGguaW50ZWcwMS5kZXYtZnJhbmNlY29ubmVjdC5mci9hcGkvdjIiLCJhdWQiOiI1NGUxMTRiY2E0MWJlYjhlOTcyMDYwNjU0ZmQ4MjM5MWM3NGZiZDQxZTc1MDRmYmRiMzg2MTdkODE2YmQ0Yzk1In0.oNuI_s3l-5UKrjpTCnooXx9KtY9qjEEYUtFX1X3DnFClSZje5jiQDha8v67zrqAzvw0t3s0oUo5WPzuSEhKOsFukXZZ7z8GmEhQAhJs6C4HHtRekSmcz7xPMmpWC83QzyZTTclUgIiup_Q_0m2uCNAcSRQjQo26qXip2Srbx6pyioiSoUKhiQDktg_UUgVJOXDnFoMNWf9wXLWZhObEaPaa06_5grNdXuaYGizuN04IheUI7cHGsf1RShkETXVJhpkpUaTE2SNXE0Gs2sCgBlw3T9EuNtphPiUzP7ggUBL8yuOpmJByzNJYzyqqsGGbu_xjXD798yi3b51GiHqiKGA.woyywoot3003wDM5.s7xJKMZsGHbrAm11ygW1MUJpzpTZF_ibZwkKT86XH15PIVLSyilr7ZuNiZLniZ6sYQm4H2OaYplTV7rSV6mLXZFdpdX-OaA1sp3uUfLjLnwy5DhxOq1Y7UHlW2WwcD6pPBkxwleHsUtkLCQ5xyR2gRnnf1dlJN79lvriXZcf0zSGoZT8P5A4q2Fdc_oduMWigr34vdCNKWTJH50RyyXa2FRbzo_hI0DLWDQZ2Z-DHDy_uBsa66xymcP-fblfdx9q3ZDU7lHA_CKfjlus1inWE9-F__8esqgmGqjVOqaN_4g9R8dlJBLCtO1hl5JzLeuVtZiQRUS_0umSkcICgF4BcwDn_qMNLK4wJ9CNuTPA-W3Lw5amnIvG1Mmnr3UoEPIJR2cqB2A5j8CgMYPj_evZCEpMuJQP-ynGX43Fa-59w4-BBthu-x4kNj3CSZyrs5eZK71zjgG1ieWlSl5iAZUTPclxuOUfbKfoRE0nUwR6hbXHwNWu97nr0Sh7HGfdYm1qfGBatHJKWKZNIb6SqDkc0Xo7-F3DO50-T5kK-USMIdY-ekit5hapcP6cXqZb_fcUMiP6RT5CN9sT6fWTZn5QvMKvxwxE_BcXKLw8P6nScnCjHMsJHs4lz-ww1n8yWDKQEg-hTC8AG-KyGRqUKRqqPBhrAOEh74qHQSE-ZzE-cce6CM-tOEfFtFzqRRjwQLKIL9BE9haCLCf7Met6iqO-Zl9Qrbr5eEBW-IPPu-6s7EmJDCqR45ml3J-yJfNQQ4mSBAqM9nP1-1q9fMrcjRV0F2z3yTm0sK1stt5JJ98sDF9QoEgsqoIfq3U4wDo1llh4y_ULQGcJc4I_j-sM1UaCTUhLbPbF85vLwcJTOnlwcmkb_YXBhUs_7F_HJ_WHvHAVSzvg6Ujf4Nl9bhkoe0KrWxgP8lx_1MX7lNVeTEUaFd4BOigPkbChxwvtLCE466IIl4jrT7Si.jk3Rkiwre1ry0mpASXTeQA',
//   scope: 'profile openid',
//   token_type: 'Bearer',
// };

// axios.get(
//   'https://auth.integ01.dev-franceconnect.fr/api/v2/userinfo',
//   { headers: { Authorization: `Bearer ${token.access_token}` } },
// );

const data = 'eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00iLCJjdHkiOiJKV1QiLCJraWQiOiJiNmM1MzUwYS0wMDUwLTQ4N2EtYTkwNS05NTFkMjNjYjE4ZjYiLCJpc3MiOiJodHRwczovL2F1dGguaW50ZWcwMS5kZXYtZnJhbmNlY29ubmVjdC5mci9hcGkvdjIiLCJhdWQiOiI1NGUxMTRiY2E0MWJlYjhlOTcyMDYwNjU0ZmQ4MjM5MWM3NGZiZDQxZTc1MDRmYmRiMzg2MTdkODE2YmQ0Yzk1In0.nbvjIWoKLy5s9XSmANHbBnMN2bA7bfJ7xhuQedQzVPLL-dLaX_QzYLv-TgqA5ahDclEKggoFqmuLnrAUyqVT47CbR-4nqXjloDhlmqGzUSuxCfFK7XmqpJu4HGqgp8uKXp2CgWIS-ue86dtoBZeOie78EP6yFki6DK38O7D42RqCxpSH53EDBCYaOpm68CZDsSApPWJfeo-TJ19Os5HxSNGE6VsrcuwyhFaUPVSb-g1gp9FAgNFMyExicdNqPgMyxpB0Yz6H36Qqr5ZNm_XlJVUNWVQPTb6gLjq5LvZNjiU3B05tUq8LTX4FcgI9-VYw6W4BqAl8rX9gz7N4aZ1FYQ.JkNOII9AEPUWykwK._9lqaMl30opmk09MEbutcAKlJoQLx_1KXtavzmJMJZWJ6LpQWBoivgzIMO83CmfhyqHFEEc_ZfWHYMGj2rNuw7vMhCuxchnQjT67uFnvryRUJ3Z2CJoJZPPj4-Rvy0U9u0agzjoFrRjojB8gVei9Ufuakzo77qg_hPv97t8kThkU5hYaZ7p7nIKqNfpoE7t9r4ZTLRNADGT7UlZVCyZPTbmdu9uVwfnRVNAacMXg7icTNwQNf3GBACJA8JMgqFVJJ2XI8gj8ABQt_GP23dWC-W9URdrSZGCK6RosgC_zwITJmuiwODJlX0CeJ8PzT06gbXNR0i-md9lXjeHVsWZ23hlskqVID-kchOaefF52MrCUaBUwR0E9wFIfRDN3k-HVPoo4tWB9JQ3XZ9GriLnkwrIIgRLTEqZIRcZZqUhXhk2niprCRJ-0fn1eI1pB9R2BBGJVVWa0tblWnV5VTSmxkwj3oKPcnQyUrUdGmKXalp4ARg31U847MXxh7NukkGZxF9HDh6qfK2Hya3U1lZTBer57zwiba1a3Qm_cTeEVK4TK3-nDCVSI5de9-kr4K_9zoRLkQmUnfO8EEQkgUHZWZ2l5cHvJnKFc4XMUBkZSQPJ2cFAdz5jFWMAO0kXXIA4DbqjPU5tRsKor8Jnq7GdNYNMAnayMAG35GQCvlluUZ5B15R-mX9RNfaUXzPMnf3j_7KK1CDmZ3pjlMcaTvspzNSYNij335by3YGMcIsORg3lGc5fF5emLkiZb6e9nJXx3eq8CrEoRrj5B355whMO78p0jHqJYsbn_tEfjRa0hk4ZycWFDEupjuMsOB5LfTw.7p6tfsrWvTp3LafgEL68Hw';

