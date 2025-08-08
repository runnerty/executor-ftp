'use strict';

const fs = require('fs');
const Client = require('ssh2-sftp-client');
const { Executor } = require('@runnerty/module-core');

class FTPExecutor extends Executor {
  constructor(process) {
    super(process);
  }

  async exec(params) {
    const options = { ...params };

    if (options.command) options.command = String(options.command).toLowerCase();

    // Compatibilidad: permitir 'user' además de 'username'
    if (options.user && !options.username) options.username = options.user;

    // Normalizar puerto a número
    if (options.port && typeof options.port === 'string') {
      const parsedPort = Number(options.port);
      if (!Number.isNaN(parsedPort)) options.port = parsedPort;
    }

    // Resolver clave privada a partir de privateKeyPath o privateKey (ruta o contenido)
    try {
      if (options.privateKeyPath && !options.privateKey) {
        options.privateKey = fs.readFileSync(options.privateKeyPath);
      } else if (options.privateKey && typeof options.privateKey === 'string') {
        // Si es ruta existente, leer; si es contenido PEM, mantener
        if (fs.existsSync(options.privateKey)) {
          options.privateKey = fs.readFileSync(options.privateKey);
        } else if (!options.privateKey.includes('BEGIN')) {
          // No parece PEM y no existe como fichero
          // dejar tal cual para no romper, ssh2 lo ignorará si no es válido
        }
      }
    } catch (err) {
      this.end({
        end: 'error',
        messageLog: `Error reading privateKey/privateKeyPath: ${err.message}`,
        err_output: `Error reading privateKey/privateKeyPath: ${err.message}`
      });
      return;
    }

    const sftp = new Client();

    try {
      const connectionOptions = {
        host: options.host,
        port: options.port,
        username: options.username,
        password: options.password,
        privateKey: options.privateKey,
        passphrase: options.passphrase,
        readyTimeout: options.readyTimeout
      };

      await sftp.connect(connectionOptions);

      // Manejo de errores emitidos por la conexión ya establecida
      sftp.on('error', err => {
        this.end({
          end: 'error',
          messageLog: `Error ftp: ${err}`,
          err_output: `Error ftp: ${err}`
        });
      });

      if (!options.command || typeof sftp[options.command] !== 'function') {
        await sftp.end();
        this.end({
          end: 'error',
          messageLog: `Invalid or missing command: ${options.command}`,
          err_output: `Invalid or missing command: ${options.command}`
        });
        return;
      }

      let data;

      // Ejecución por comandos conocidos con firma específica
      switch (options.command) {
        case 'list':
          data = await sftp.list(options.sourcePath);
          break;
        case 'put':
          data = await sftp.put(options.sourcePath, options.destinationPath, options.addtionalOptions);
          break;
        case 'get':
          data = await sftp.get(options.sourcePath, options.destinationPath, options.addtionalOptions);
          break;
        case 'mkdir': {
          let recursive = false;
          if (typeof options.recursive === 'boolean') {
            recursive = options.recursive;
          } else if (typeof options.addtionalOptions === 'boolean') {
            recursive = options.addtionalOptions;
          } else if (options.addtionalOptions && typeof options.addtionalOptions === 'object') {
            recursive = Boolean(options.addtionalOptions.recursive);
          }
          data = await sftp.mkdir(options.destinationPath, recursive);
          break;
        }
        case 'rmdir': {
          let recursive = false;
          if (typeof options.recursive === 'boolean') {
            recursive = options.recursive;
          } else if (typeof options.addtionalOptions === 'boolean') {
            recursive = options.addtionalOptions;
          } else if (options.addtionalOptions && typeof options.addtionalOptions === 'object') {
            recursive = Boolean(options.addtionalOptions.recursive);
          }
          data = await sftp.rmdir(options.destinationPath, recursive);
          break;
        }
        case 'delete':
          data = await sftp.delete(options.destinationPath, options.addtionalOptions);
          break;
        case 'rename':
          data = await sftp.rename(options.sourcePath, options.destinationPath);
          break;
        case 'chmod':
          data = await sftp.chmod(options.destinationPath, options.mode);
          break;
        default:
          // Llamada genérica manteniendo compatibilidad hacia atrás
          data = await sftp[options.command](
            options.sourcePath,
            options.destinationPath,
            options.useCompression,
            options.encoding,
            options.addtionalOptions
          );
      }

      await sftp.end();

      this.end({
        end: 'end',
        data_output: data,
        extra_output: options.command === 'list' ? data : undefined
      });
    } catch (err) {
      try {
        await sftp.end();
      } catch (e) {
        // ignore
      }
      this.end({
        end: 'error',
        messageLog: `Error ftp connection: ${err}`,
        err_output: `Error ftp connection: ${err}`
      });
    }
  }
}

module.exports = FTPExecutor;
