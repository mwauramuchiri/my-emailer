<template>
  <div>
    <EmailBox
      v-for="(email_type, index) in emailTypes"
      v-bind:id="'emails-' + email_type"
      v-bind:key="index"
      v-bind:email-type.camel="email_type"
      v-bind:emails="emails[email_type]"
    />
  </div>
</template>

<script>
import EmailBox from "./EmailBox.vue";
import emailMixin from "@/mixins/emailMixin";
import toast from "@/modules/toastify";
import _debounce from "lodash/debounce";

const errorEmailToMessage = "You need atleast one valid email in the email 'to' option";

export default {
  name: "EmailForm",
  components: {
    EmailBox
  },
  mixins: [emailMixin],
  props: {
    getEmails: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      emailTypes: ["to", "cc", "bcc"],
      emails: {
        // to: ["gramwauu@gmail.com", "gabu@jikonipalatables.com", "gabu@404culture.digital"],
        to: [],
        cc: [],
        bcc: []
      }
    };
  },
  watch: {
    getEmails: function(val) {
      if(val == false) {
        return;
      }
      let data = {
        to: this.getValidEmails(this.emails.to),
        cc: this.getValidEmails(this.emails.cc),
        bcc: this.getValidEmails(this.emails.bcc)
      }
      Object.freeze(data);
      this.$emit("info-is-valid", data, "emails");
    },
    "emails.to": _debounce(function(val, oldVal) {
      this.isValidEmailTo(val);
    }, 450)
  },
  methods: {
    isValidEmailTo: function(email) {
      const isValid = this.isValidEmail(email);

      if(!isValid) {
        toast(errorEmailToMessage, 4000, "emailer-toast--warning");
      }
      this.$emit("valid-email-to", !isValid);
    }
  }
};

</script>

<style></style>
