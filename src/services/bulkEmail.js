/**
 * Created by asmelitus@gmail.com on 29/11/2018.
 */
const nodemailer = require("nodemailer");
const async = require("async");

function BulkMailer(config) {
    "use strict";
    if (!config.transport) {
        throw "transport not found!";
    }
    this.nodemailer = nodemailer.createTransport(config.transport);
    this.isVerbose = config.verbose || false;
}

BulkMailer.prototype.send = function (info, single, callback) {
    "use strict";
    const that = this;
    const receivers = [];
    if (single) {
        receivers = info.to.split(",");
    } else {
        receivers = [info.to];
    }
    const tasks = [];
    async.each(receivers, function (developer, eachCB) {
        tasks.push(function (callback) {
            info.to = developer;
            that.nodemailer.sendMail(info, callback);
        });
        eachCB();
    }, function (error) {
        if (!error) {
            async.parallel(tasks, function (error, results) {
                if (error) {
                    return callback(error, results);
                }
                else {
                    if (that.isVerbose) {
                        console.info('Mail sent to respective developers!');
                    }
                    return callback(null, results);
                }
            });
        }
        else {
            if (that.isVerbose) {
                console.error(error);
            }
            return callback(error);
        }
    });
};
module.exports = BulkMailer;