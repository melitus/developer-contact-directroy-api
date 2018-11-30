const mjml2html = require('mjml');

const credentials = require('../config/credentials');
const registrationTemplate = require('../templates/email/registration');
const client = require('../config/client');
const BulkMailer = require("../services/bulkEmail");
const Developer = require('../models/developer.model');

const bulkMailer = new BulkMailer({ transport: credentials.email, verbose: true });

const __mailerOptions = (hash, options) => {
  const companyLogo = client.logoUrl;
  const verificationUrl = `${client.baseUrl}${client.verifyEmail}/${hash}`;
  const template = registrationTemplate(companyLogo, verificationUrl);
  const html = mjml2html(template);

  const mailOptions = options;
  mailOptions['html'] = html.html;
  mailOptions['text'] = 'Hi there!';
  mailOptions['from'] = credentials.email.auth.developer;
  mailOptions['subject'] = 'Please verify your email';

  return mailOptions;
}
module.exports = {
  sendVerificationEmail: (hash, options) => {
    const mailerOptions = __mailerOptions(hash, options);
    bulkMailer.send(mailerOptions, true, (error, result) => { // arg1: mailinfo, agr2: parallel mails, arg3: callback
      if (error) {
        console.error(error);
      } else {
        console.info(result);
      }
    });
  },

  verifyDeveloperEmail: async (req, res, next) => {
    const { uuid } = req.params;

    try {
      const message = await Developer.verifyEmail(uuid);
      return res.send(message);
    } catch (err) {
      return next(err);
    }
  },

  verifyMobileOtp: async (req, res, next) => {
    const { email, otp } = req.body;
    try {
      const message = await Developer.verifyMobileOtp(email, otp);
      return res.send(message);
    } catch(err) {
      return next(err);
    }
  },
}