import Bee from "@mailupinc/bee-plugin";
import toast from "./toastify";
import { confirmReload } from "./misc";
import _forEach from "lodash/forEach";
import _flatMapDeep from "lodash/flatMapDeep";
import _compact from "lodash/compact";
import _debounce from "lodash/debounce";
import axios from "./axios";

const $Bee = new Bee();

export const BeeConfig = {
  uid: "emailerSAAS", // [mandatory]
  container: "template-generator", // [mandatory]
  autosave: false, // [optional, default:false]
  language: "en-US", // [optional, default:"en-US"]
  trackChanges: true, // [optional, default: false] 
  // specialLinks: [[{
    // type: 'Subscription', // Submenu name that groups links
    // label: 'Unsubscribe', // Menu label
    // link: '{{unsubscribe}}' // HREF emitted in the HTML
  // }], // [optional, default:[]] 
  mergeTags: [ // [optional, default:[]]
    {
      name: 'Name', // The menu label
      value: '{{name}}' // What's emitted in the HTML for post-processing
    },
    {
      name: 'Link',
      value: '{{link}}'
    }
  ],
  // mergeContents: mergeContents, // [optional, default:[]]
  preventClose: true, // [optional, default:false]
  // editorFonts: {}, // [optional, default: see description]
  // roleHash: "", // [optional, default: ""]
  // rowDisplayConditions: {}, // [optional, default: {}]
  onSave: function (jsonFile, htmlFile) {
		return saveTemplate({ jsonFile, htmlFile }, $Bee.instance.templateName, $Bee.instance.templateName + ".json");
    /* Implements function for save */
  }, // [optional]
  onChange: function (jsonFile, response) {
    /* Implements function for change */
  }, // [optional]
  onSaveAsTemplate: async function (jsonFile) {
    var _templateName = prompt(`Please give your template a name`, '');

    $Bee.instance.templateName = _templateName;

    await saveTemplate(jsonFile, _templateName, false, true);
  },
  onAutoSave: function(jsonFile) {
    saveTemplate({ jsonFile }, $Bee.instance.templateName, $Bee.instance.templateName + ".json")
  },
  onSend: function (htmlFile, e) {
    return new Promise((resolve, reject) => {
      if ($Bee.instance.send.prototype.hasOwnProperty("data")) {
        // Probably should delete? the .proto.data()
        const data = $Bee.instance.send.prototype.data();
        const sockid = $Bee.instance.send.prototype.sockid || "";
  
        axios.post("/send", { htmlFile, data, sockid })
          .then((res) => {
          resolve(res);
          var toastMessageClassName = res.data.ok ? "" : "emailer-toast--error";
          var rejectedEmails = _flatMapDeep(res.data.message, ({ rejected }) => rejected.length > 0 ? rejected : null);
          rejectedEmails = _compact(rejectedEmails);

          _forEach(rejectedEmails, _debounce((email) => {
            toast(`email to ${email} could not be sent`, 7000, "emailer-toast--error");
          }, 300, { trailing: true }));

          // Show server message using toast.
          // if successful, give option to reload
          if(res.data.ok == true) {
            // if the email was sent as bulk emails
            toast(`Emails sent! Click this message to reload app`, 10000, toastMessageClassName, confirmReload);
          }
          
          delete $Bee.instance.send.prototype.data;
          delete $Bee.instance.send.prototype.sockid;
        })
          .catch((err) => {
          console.error(err);
          reject(err);
        });
  
      } else {
        // SHOW TOAST
        console.error("Emailer data not found");
        reject("Emailer data not found");
        toast("Make sure you have created an emails list in the mail bubble at the left side of the screen", 7000);
      }
    });
  },
  onLoad: function (jsonFile) {
    /* Implements function to perform an action once the template is loaded */
  }, // [optional]
  onError: function (errorMessage) {
    console.error(errorMessage);
    /* Implements function to handle error messages */
    _forEach(errorMessage, (value, key) => {
      toast(`${key}:\n${value}`, 7000, "emailer-toast--error");
    });
  },
  onWarning: function (alertMessage) {
    /* Implements function to handle error messages */
    toast(alertMessage, 7000, "emailer-toast--warning");
  }
}

export default $Bee.getToken(process.env.VUE_APP_BEEFREE_CLIENT_ID, process.env.VUE_APP_BEEFREE_CLIENT_SECRET)
  .then(async () => {
    return $Bee;
  })
  .catch((err) => {
    toast(`Error in initializing BeeFree \n Message: ${err}`, 10000, "emailer-toast--error", () => location.reload());
  });

/**
 * 
 * @param {Object} file could be the json file or an object with both jsonFile and Html
 * @param {String} templateName user types the preffered template name
 * @param {String|Boolean} saveTo if false, create a new file, else save to the file's name
 * @param {Boolean} _showToast 
 */
function saveTemplate(file, _templateName, saveTo = false, _showToast = true) {
  return new Promise((resolve, reject) => {
    axios.post("/save", {
      file,
      templateName: _templateName,
      saveTo,
    })
      .then((res) => {
        var toastMessageClassName = res.data.ok ? "" : "emailer-toast--error";

        // if (res.data.ok == true) {
        //   $Bee.instance.templateName = res.data.data;
        // }
        // Show server message using toast
        // if successful, give option to reload
        if(_showToast == true) {
          toast(res.data.message, 4000, toastMessageClassName);
        }

        resolve(res.data);
      })
      .catch((err) => {
        toast(err, 7000, "emailer-toast--error");
        console.error(err);
        reject(err);
      });
  });
}
