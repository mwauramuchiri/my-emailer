const nodemailer = require("nodemailer");
const { eHost, ePort, eSecure, eAuth } = require("./emailer-config");

const emailer = class {
  constructor(config) {
    // console.log("config: ", config);
    this.setTransporter = config;
    this.fromName = config.senderInformation.name;
    this.fromEmail = config.senderInformation.email;
    this.sendBulk = config.sendBulkEmails || false; // default to true
    this.subject = config.subject || "";
    this.sock = config.sock;
    this.sockid = config.sockid || "";
  }

  get senderFrom() {
    return `"${this.fromName}" <${this.fromEmail}>`;
  }

  set setTransporter(config) {
    // console.log("000:", config.senderInformation.host);
    this.transporter = nodemailer.createTransport({
      host: config.senderInformation.host || eHost,
      connectionTimeout: 5 * 60 * 1000,
      port: ePort,
      secure: eSecure, // upgrade later with STARTTLS
      auth: {
        user: config.senderInformation.email || eAuth.user,
        pass: config.senderInformation.password || eAuth.pass
      }
    });
  }

  get getTransporter() {
    return this.transporter;
  }

  /**
   * convert from array to string joined by `,`
   * @param {Array} emails Array of emails
   */
  stringifyEmails(emails) {
    var emailsStr = emails.join(", ");

    if (emailsStr.length == 0) {
      return null;
    } else {
      return emailsStr;
    }
  }

  async send(emailsToSend, html, from = this.senderFrom) {
    var mailData = {
      from,
      subject: this.subject,
      html
    };
    var mailResponse = {};
    var mailsSent = 0;
    console.log(typeof html);

    const send = async () => {
      return await this.transporter.sendMail(mailData);
    };

    // attach to|cc|bcc
    for (const emailType in emailsToSend) {
      const emails = this.stringifyEmails(emailsToSend[emailType]);

      if (emails) {
        mailData[emailType] = emails;
      }
    }

    if (this.sendBulk == false) {
      for (let i = 0; i < emailsToSend.to.length; i++) {
        const email = emailsToSend.to[i];
        mailData["to"] = email;

        mailResponse[email] = await send();

        // socket toast
        if (this.sock) {
          console.log("server notification...", this.sockid);
          this.sock.to(this.sockid).emit("emailer-notify", mailResponse[email]);
        }

        // if the email was successfully sent, remove bcc and cc to prevent sending multiple times
        if (mailResponse[email].rejected.length == 0) {
          mailsSent++;

          if (mailsSent !== 0) {
            mailData["bcc"] = "";
            mailData["cc"] = "";
          }
        }

        // count
        // eslint-disable-next-line prettier/prettier
        console.log((i + 1) + "/" + emailsToSend.to.length);
        // eslint-disable-next-line prettier/prettier
        if ((i + 1) == emailsToSend.to.length) {
          console.log("============");
          console.log("all " + emailsToSend.to.length + " emails sent");
          console.log("============");
        }
      }
    } else {
      mailResponse["all"] = await send();
    }

    return mailResponse;
  }
};

module.exports = emailer;
