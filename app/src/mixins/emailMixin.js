import { isValidEmail, isGmail } from "@/modules/emailValidator";

const emailMixin = {
  methods: {
    isValidEmail: function(email) {
      return isValidEmail(email);
    },
    isGmail: function(email) {
      return isGmail(email);
    },
    /**
     * 
     * @param {Array} emails emails to validate
     * @returns {Array} valid emails
     */
    getValidEmails: function(emails) {
      var validEmails = [];

      for (let i = 0; i < emails.length; i++) {
        const email = emails[i];

        if(isValidEmail(email)) {
          validEmails.push(email);
        }
      }

      return validEmails;
    }
  }
}

export default emailMixin;