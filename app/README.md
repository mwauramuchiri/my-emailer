# vue-node-emailer

desktop pwa for sending designed html emails

- VueJS
- BeeFree html email creator

## Components Structure

BaseModal.vue
  (Grid)
  - EmailConfigs.vue (column)
    - inputs

  - EmailForm.vue (column)
    - EmailBox.vue for to|cc|bcc
      - EmailChip.vue
        > dragAndDrop.js (mixin)
        - BaseIconClose.vue
      - email input

### BaseModal.vue
Has an open button floating to the lower left side of the app

### EmailConfigs.vue
mailer inputs are

- Subject
- Sender name
- Host
- Sender email address (gmail addresses don't work)
- Password
- Send as bulk emails (Checkbox.vue)

### EmailForm.vue
keeps form information for to|cc|bcc emails, and also controls the types of EmailBox.vue \n
~ This can be replaced by use of emails.js $store

### EmailBox.vue
validates the typed email addresses and ignores the invalid emails
$emits the emails to EmailForm.vue


## 'send-email' $event

attaches data to BeeFree then sends emails