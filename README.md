# FTP executor for [Runnerty]:

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
connection config you will see [here](https://github.com/mscdex/ssh2#user-content-client-methods)

### Commands
* get: download a file.
* put: upload a file.
* mkdir: create a new directory.
* rmdir: remove the directory or file.
* delete: delete file.
* rename: rename sourcePath to destinationPath.
* chmod: modify rights to destinationPath file.
* list: retrieves a directory listing.

List command information:
```
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
