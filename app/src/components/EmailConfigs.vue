<template>
  <div style="margin-bottom: 100px;">
    <div class="email-box email-box--config">
      <h3 class="config-box__item__title">
        Sender's email information
      </h3>
    </div>
    <div class="config-box">
      <div class="config-box__item">
        <label class="config-box__item__title config-box__item__title--light">
          Subject
        </label>
        <br>
        <input
          v-model="subject"
          type="text"
          class="config-box__item__input"
        >
      </div>
      <div class="config-box__item">
        <label class="config-box__item__title config-box__item__title--light">
          Sender name
        </label>
        <br>
        <input
          v-model="senderInformation.name"
          type="text"
          class="config-box__item__input"
        >
      </div>
      <div class="config-box__item">
        <label class="config-box__item__title config-box__item__title--light">
          host
        </label>
        <br>
        <input
          v-model="senderInformation.host"
          type="text"
          class="config-box__item__input"
        >
      </div>
      <div class="config-box__item">
        <label class="config-box__item__title config-box__item__title--light">
          Sender email address
        </label>
        <label
          v-show="!isValidSenderEmail"
          class="config-box__item__title config-box__item__title--light config-box__item__title--important"
        >
          (...@gmail.com not allowed)
        </label>
        <br>
        <input
          v-model="senderInformation.email"
          type="email"
          v-bind:class="['config-box__item__input', { 'config-box__item__input--invalid': !isValidSenderEmail }]"
        >
      </div>
      <div class="config-box__item">
        <label class="config-box__item__title config-box__item__title--light">
          Password
        </label>
        <br>
        <input
          v-model="senderInformation.password"
          type="password"
          class="config-box__item__input"
        >
      </div>
      <div class="config-box__item">
        <Checkbox
          v-model="sendBulkEmails"
          color="#1E88E5"
          v-bind:font-size.camel="18"
          v-bind:size="21"
        >
          Send as bulk emails
        </Checkbox>
      </div>
    </div>
    <button
      ref="sendButton"
      class="config-box__action-send config-box__action-send--block"
      v-bind:disabled="sendIsDisabled"
      v-on:click="sendEmail"
    >
      Send
    </button>
  </div>
</template>

<script>
import Checkbox from "vue-material-checkbox";
import _debounce from "lodash/debounce";
import _capitalize from "lodash/capitalize";
import emailMixin from "@/mixins/emailMixin.js";
import toast from "@/modules/toastify";

export default {
  name: "EmailConfigs",
  components: {
    Checkbox
  },
  mixins: [emailMixin],
  props: {
    sendIsDisabled: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      subject: "emailer",
      sendBulkEmails: false,
      senderInformation: {
        name: "",
        email: process.env.VUE_APP_EMAIL_DEFAULT_EMAIL,
        password: process.env.VUE_APP_EMAIL_DEFAULT_PASSWORD,
        host: process.env.VUE_APP_EMAIL_DEFAULT_HOST
      }
    }
  },
  computed: {
    isValidSenderEmail: function() {
      // show error only when there's some data in the email property
      if(this.senderInformation.email.length > 0) {
        return this.isValidEmail(this.senderInformation.email) && !this.isGmail(this.senderInformation.email);
      } else {
        return true;
      }
    }
  },
  methods: {
    sendEmail: _debounce(function() {
      if(
        this.isValidSenderEmail
        && this.subject.length > 0
        && this.senderInformation.name.length > 1
        && this.senderInformation.host.length > 0
        && this.senderInformation.password.length > 0
      ) {
        
        let data = {
          // subject: _capitalize(this.subject),
          subject: this.subject,
          sendBulkEmails: this.sendBulkEmails,
          senderInformation: {
            name: this.senderInformation.name,
            email: this.senderInformation.email,
            password: this.senderInformation.password,
            host: this.senderInformation.host
          }
        };
        Object.freeze(data.senderInformation);
        Object.freeze(data);
        
        this.$emit("info-is-valid", data, "config");
      } else {
        console.warn("Sender information is not valid");
        toast("Sender information is not valid", 7000, "emailer-toast--error");
      }
    }, 2400, { leading: true, trailing: false })
  }
};
</script>

<style lang="scss">
.config-box {
  max-width: 600px;
  display: block;
  position: relative;
  // margin-bottom: 16px;
  padding: 16px;
}

.config-box__item {
  display: block;
  position: relative;
  margin-bottom: 16px;
}

.config-box__item__title {
  font-size: 21px;
  font-family: $fontLexend;
  margin-bottom: 8px;
  padding: 0 16px;
  display: inline-block;
}

.config-box__item__title--light {
  opacity: 0.54;
  font-weight: 300;
  font-size: 16px;
}

.config-box__item__title--important {
  opacity: 0.81;
  color: adjust-hue($color: $yellow, $degrees: -16) ;
  font-weight: 500;
  font-size: 12px;
}

.config-box__item__input {
  outline: none;
  outline-color: transparent;
  outline-width: 0px;
  border: 1px solid var(--grey);
  border-radius: 3px;
  font-family: $fontManjari;
  line-height: 40px;
  height: 40px;
  width: calc(100% - 16px);
  padding: 0 8px;
  margin: 0 8px;
  box-sizing: border-box;
}

.config-box__item__input--invalid {
  border-color: var(--red);
}

.config-box__action-send {
  cursor: pointer;
  border: none;
  display: block;
  background-color: var(--blue);
  color: var(--white);
  text-align: center;
  border-radius: 3px;
  font-family: $fontManjari;
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  padding: 14px 24px;
  margin: 0 24px 20px 24px;
  transition-duration: .18s;
  transition-timing-function: cubic-bezier(0.785, 0.135, 0.15, 0.86);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);

  &:disabled {
    background-color: var(--grey);
  }
}

.config-box__action-send--block {
  display: block;
  width: calc(100% - 48px);
  box-sizing: border-box;
}
</style>
