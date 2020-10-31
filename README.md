<p align="center">
  <a href="http://runnerty.io">
    <img height="257" src="https://runnerty.io/assets/header/logo-stroked.png">
  </a>
  <p align="center">Smart Processes Management</p>
</p>

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Dependency Status][david-badge]][david-badge-url] 
<a href="#badge">
  <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg">
</a>


# FTP executor for [Runnerty]:

### Installation:
```bash
npm i @runnerty/executor-ftp
```

### Configuration sample:
```json
{
  "id": "ftp_default",
  "type": "@runnerty-executor-ftp",
  "host": "host.com",
  "port": "21",
  "user": "user",
  "password": "1234"
}
```

```json
{
  "id": "ftp_default",
  "type": "@runnerty-executor-ftp",
  "host": "host.com",
  "port": "21",
  "user": "user",
  "privateKey": "/privateKeys/myPrivateKey.pem"
}
```

### Plan sample:
```json
{
  "id": "ftp_default",
  "command": "PUT",
  "sourcePath": "./sample.txt",
  "destinationPath": "/remote/sample_file.txt"
}
```

```json
{
  "id": "ftp_default",
  "command": "LIST",
  "sourcePath": "./remoteDir/"
}
```

### Connection:
Connection config you will see [here](https://github.com/mscdex/ssh2#user-content-client-methods)

### Commands
* get: download a file.
* put: upload a file.
* mkdir: create a new directory.
* rmdir: remove the directory or file.
* delete: delete file.
* rename: rename sourcePath to destinationPath.
* chmod: modify rights to destinationPath file.
* list: retrieves a directory listing.

### Output (Process values):
* `PROCESS_EXEC_DATA_OUTPUT`: Response output data.
* `EXTRA_DATA`: It is possible to work with the parsed values of the response.

`LIST` command return a JSON with this properties:
```bash
type: // file type(-, d, l)
name: // file name
size: // file size
modifyTime: // file timestamp of modified time
accessTime: // file timestamp of access time
rights: {
    user:
    group:
    other:
},
owner: // user ID
group: // group ID
```



[Runnerty]: http://www.runnerty.io
[downloads-image]: https://img.shields.io/npm/dm/@runnerty/executor-ftp.svg
[npm-url]: https://www.npmjs.com/package/@runnerty/executor-ftp
[npm-image]: https://img.shields.io/npm/v/@runnerty/executor-ftp.svg
[david-badge]: https://david-dm.org/runnerty/executor-ftp.svg
[david-badge-url]: https://david-dm.org/runnerty/executor-ftp
[config.json]: http://docs.runnerty.io/config/
[plan.json]: http://docs.runnerty.io/plan/
