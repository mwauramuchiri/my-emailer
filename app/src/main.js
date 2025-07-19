/* eslint-disable no-console */
import Vue from "vue";
import store from "./store/index";
import App from "./App.vue";
import Bee, { BeeConfig } from "./modules/beeFree";
import toast from "./modules/toastify";
import socket from "socket.io-client";
import axios from "./modules/axios";

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true;
}

Vue.config.keyCodes.backspace = 8;

const vm = new Vue({
  store,
  render: h => h(App)
});

const $BeeProm = Bee.finally(() => vm.$mount("#emailer"));

const sock = socket(process.env.APP_URL, {
  path: '/io'
});

sock.on("emailer-notify", (message) => {
  if (Object.prototype.hasOwnProperty.call(message, "accepted")) {
    message.accepted.forEach(email => {
      toast(`email sent to ${email}`, 7000);
    });
  }
});

vm.$on("send-email", function(data) {
  // Mount emailer after templator is loaded
  $BeeProm.then(async ($Bee) => {
    // console.log($Bee);

    if (!$Bee.instance) {
      toast("Select a template to send email", 5000);
      return;
    }

    var confirmSend = true;
    // If data property already exists, it could be a multiple clicked action
    if ($Bee.instance.send.prototype.hasOwnProperty("data")) {
      confirmSend = confirm("Try sending emails again?");
    }

    if(confirmSend) {
      $Bee.instance.send.prototype.data = () => data;
      $Bee.instance.send.prototype.sockid = sock.id;
      console.log($Bee.instance.send.prototype);
      await $Bee.instance.send();
      toast("Sending...", 10000);
      
    } else {
      toast("Sending cancelled", 4000, "");
    }
  });
});

vm.$on("start-bee", function(selectedTemplate) {
  $BeeProm.then(async ($Bee) => {
    // console.log("templateName", selectedTemplate);
    const beeTemplateLocal = `get-template?t=${selectedTemplate}`;

    const {
      data
    } = await axios.get(beeTemplateLocal);

    await $Bee.start(BeeConfig, data.data);
    
    $Bee.instance.templateName = selectedTemplate.split('.json')[0]
  })
});

window.vm = vm;

