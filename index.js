"use strict";

const fs = require("fs");
const Client = require("ssh2-sftp-client");
const sftp = new Client();

const Execution = global.ExecutionClass;

class ftpExecutor extends Execution {
  constructor(process) {
    super(process);
  }

  exec(res) {
    let _this = this;

    res.command = res.command.toLowerCase();
    if(res.privateKey){
      res.privateKey = fs.readFileSync(res.privateKey);
    }

    sftp
      .connect(res)
      .then(() => {
      // If connect - Catching errors:
        sftp.on("error", (err) => {
          const endOptions = {
            end: "error",
            messageLog: `Error ftp: ${err}`,
            err_output: `Error ftp: ${err}`
          };
          sftp.end();
          _this.end(endOptions);
        });

        sftp[res.command](res.sourcePath, res.destinationPath, res.useCompression, res.encoding, res.addtionalOptions)
          .then((data) => {
            const endOptions = {
              end: "end",
              data_output: data
            };
            sftp.end();
            _this.end(endOptions);
          });
      })
      .catch((err) => {
        const endOptions = {
          end: "error",
          messageLog: `Error ftp connection: ${err}`,
          err_output: `Error ftp connection: ${err}`
        };
        _this.end(endOptions);
      });

  }
}

module.exports = ftpExecutor;