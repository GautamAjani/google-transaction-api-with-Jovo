// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  alexaSkill: {
    nlu: 'alexa',
  },
  googleAction: {
    // nlu: 'dialogflow',
    dialogflow: {
      ordersv3: true,
    }
  },
  endpoint: '${JOVO_WEBHOOK_URL}',
};
