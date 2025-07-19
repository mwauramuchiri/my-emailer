<template>
  <div
    v-bind:id="id"
    v-bind:class="['email-box', { 'email-box--is-dropping': chipIsDropping }]"
    dropzone="true"
    v-on:dragleave="chipIsDropping = false"
    v-on:dragover.prevent="chipIsDropping = true"
    v-on:drop="dropped(emailType, $event)"
  >
    <label class="email-box__title">{{ emailType }}</label>
    <br>
    <!-- <ul class="email-box__list"> -->
    <transition-group
      class="email-box__list"
      appear
      name="email-chip-"
      tag="ul"
    >
      <EmailChip
        v-for="(email, index) in emails"
        v-bind:key="'chip--' + index"
        v-bind:email-chip-input-ref.camel="'email-chip-input-' + index"
        v-bind:index="index"
        v-bind:email="email"
        v-bind:class="{ 'email-chip--invalid': !isValidEmail(email) }"
        v-on:remove-email="removeEmail(index)"
        v-on:update-email="updateEmail(index)"
        v-on:add-email.stop="addEmail(email)"
      />
    </transition-group>
    <!-- </ul> -->
    <input
      v-bind:ref="'email-input-' + emailType"
      class="email-box__input"
      type="email"
      placeholder="Type a valid email address/es"
      v-on:keydown.tab.prevent="addEmail"
      v-on:keyup.space="addEmail"
      v-on:keyup.enter="addEmail"
    >
  </div>
</template>

<script>
/* eslint-disable no-console */
import EmailChip from "./EmailChip.vue";
import emailMixin from "@/mixins/emailMixin.js";
import chipDragDropMixin from "@/mixins/chipDragDropMixin.js";

export default {
  name: "EmailBox",
  components: {
    EmailChip
  },
  mixins: [emailMixin, chipDragDropMixin],
  props: {
    emailType: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: false,
      default: "--"
    },
    emails: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data: function() {
    return {};
  },
  methods: {
    addEmail: async function(event, email = undefined) {
      console.log("adding email: ", email, event);

      var new_email = email || typeof event === "string" ? event : event.target.value;
      console.log(new_email);
      // cater for multiple emails in the input
      // by ; separator
      new_email = new_email.split(";");
      
      for (let i = 0; i < new_email.length; i++) {
        let email = new_email[i];

        // cater for multiple emails in the input
        // by space separator
        if (/\s/gi.test(email)) {
          let spaced_emails = email.split(" ");
          
          for (let v = 0; v < spaced_emails.length; v++) {
            let email = spaced_emails[v];

            if (this.isValidEmail(email)) {
              this.emails.push(email);
            }
          }
        } else {
          if (this.isValidEmail(email)) {
            this.emails.push(email);
          }
        }
      }

      await this.$nextTick();

      if(typeof event === "object") {
        event.target.blur();
        event.target.value = "";
      }

      return this.emailType;
    },
    removeEmail: async function(index) {
      this.emails.splice(index, 1);
      await this.$nextTick();
    },
    updateEmail: async function(index) {
      var new_email = event.target.value;
      new_email = new_email.split(" ").join("");

      if (new_email.length == 0) {
        await this.removeEmail(index);
      } else {
        this.$set(this.emails, index, new_email);
      }

      await this.$nextTick();
    }
  }
};
</script>

<style lang="scss">
.email-box {
  max-width: 640px;
  display: block;
  position: relative;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--grey);
  border: 2px solid transparent;
  box-sizing: border-box;
  padding: 8px 8px 16px 8px;
}

.email-box__title {
  font-size: 21px;
  font-family: "Lexend Exa", sans-serif;
  margin-bottom: 8px;
  display: inline-block;
}

.email-box__list {
  position: relative;
  display: inline-flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: 4px;
  
}

.email-box--is-dropping {
  background-color: rgba($color: $light-blue, $alpha: 0.54);
  border: 2px solid rgba($color: $blue, $alpha: 0.54);
}

.email-box__input {
  outline: none;
  outline-color: transparent;
  outline-width: 0px;
  border: none;
  border-bottom: 2px solid var(--yellow);
  height: 32px;
  min-width: 240px;
  padding: 0 8px;
  font-size: 18px;
  line-height: 32px;
  background-color: transparent;
  display: inline-flex;
}

.email-box__input::placeholder {
  font-size: 15px;
  line-height: 32px;
}
</style>
