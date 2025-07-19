export default {
  states: {
    emailTypes: ['to', 'cc', 'bcc'],
    emails: {
      to: [],
      cc: [],
      bcc: [],
    }
  },
  getters: {
    emails(state) {
      return state.emails;
    }
  },
  mutations: {
    addEmail(state, [email, emailType]) {

    },
    removeEmail(state, [email, emailType]) {

    },
    updateEmail(state, [email, emailType]) {

    }
  }
};