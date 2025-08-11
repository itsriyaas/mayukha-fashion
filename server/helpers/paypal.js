const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
 client_id: "AQBZI547hjMRYbZGNzdODQPdyddU82XiEv4DKt9s1ek8pSo5nfKaoSAupl9BBT3dXAqHfnwedMgvg8o6",
  client_secret: "ECCY1C1VnMNqocfe___HDryGqYl5tCygnhfYLjGhu0_iWoN4LpW8o_hkks0oscBL4LnA581xxMJZx4Nq",
});

module.exports = paypal;
