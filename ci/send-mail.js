const emailer = require("./src/emailer");

/**
 * NODE emailer
 * @param {String} html email html string. The html has not been processed yet
 * @param {Object} data {emails<Array>, config<Object>} Note: data is frozen (cannot change the data property values)
 */
async function sendMail(html, data, sock = {}) {
  const _e = new emailer({
    ...data.config,
    ...sock
  });

  // _e.getTransporter.verify(function(error, success) {
  //   if (error) {
  //     console.log("error start::", error, "::error end");
  //   } else {
  //     console.log("Server is ready to take our messages");
  //   }
  // });

  // return;

  var res = await _e.send(data.emails, html);

  return res;
}

module.exports = sendMail;
