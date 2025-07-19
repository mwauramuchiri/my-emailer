<template>
  <div>
    <BaseModal v-if="signedIn && selectedTemplate !== null">
      <div
        slot="modal-body"
        class="grid-row"
      >
        <div class="grid-col col-1-3">
          <EmailConfigs
            v-bind:send-is-disabled.camel="sendIsDisabled"
            v-on:info-is-valid="sendEmail"
          />
        </div>
        <div class="grid-col col-2-3">
          <EmailForm
            v-bind:get-emails.camel="getEmails"
            v-on:info-is-valid="sendEmail"
            v-on:valid-email-to="sendIsDisabled = $event"
          />
        </div>
      </div>
    </BaseModal>

    <template v-if="signedIn">
      <TemplatesList v-on:start-bee="startBee" />
    </template>
  </div>
</template>

<script>
import BaseModal from "./components/BaseModal.vue";
import EmailConfigs from "./components/EmailConfigs.vue";
import EmailForm from "./components/EmailForm.vue";
import TemplatesList from './components/TemplatesList.vue';
import axios from './modules/axios';
import toast from "@/modules/toastify";

export default {
  name: "App",
  components: {
    BaseModal,
    EmailConfigs,
    EmailForm,
    TemplatesList,
  },
  data: function() {
    return {
      getEmails: false,
      sendIsDisabled: false,
      emailsData: {},
      signedIn: false,
      selectedTemplate: null,
    };
  },
  async created() {
    axios.get('/status')
      .then(() => {
        this.signedIn = true;
      })
      .catch(() => {
        const password = prompt('Please put your password to continue', '');

        if (password) {
          axios.post('/login', { password })
            .then(() => {
              this.signedIn = true;
            })
            .catch((err) => {
            toast("Invalid password. Refresh page to try again", 5000, "emailer-toast--error");
          });
        }
      });
  },
  methods: {
    sendEmail: function(data, prop) {
      this.emailsData[prop] = data;

      if(this.getEmails == true) {
        const emailsData = Object.freeze(Object.assign({}, this.emailsData));
        Object.freeze(emailsData);

        this.$parent.$emit("send-email", emailsData);
        this.sendIsDisabled = true;
        this.getEmails = false;
      } else {
        this.getEmails = true;
      }
    },
    startBee: function(templateName) {
      this.$parent.$emit("start-bee", templateName);
      this.selectedTemplate = templateName;
    }
  },
};
</script>

<style lang="scss"></style>
