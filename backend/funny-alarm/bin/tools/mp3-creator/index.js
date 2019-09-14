const googleTTS = require('google-tts-api');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const urlParse  = require('url').parse;

// start
googleTTS('hello')
    .then(function (url) {
        console.log(url); // https://translate.google.com/translate_tts?...

        var dest = path.resolve(__dirname, 'hello.mp3'); // file destination
        console.log('Download to ' + dest + ' ...');

        return downloadFile(url, dest);
    })
    .then(function () {
        console.log('Download success');
    })
    .catch(function (err) {
        console.error(err.stack);
    });


function downloadFile(url, dest) {
    return new Promise(function (resolve, reject) {
        var info = urlParse(url);
        var httpClient = info.protocol === 'https:' ? https : http;
        var options = {
            host: info.host,
            path: info.path,
            headers: {
                'user-agent': 'WHAT_EVER'
            }
        };

        httpClient.get(options, function (res) {
            // check status code
            if (res.statusCode !== 200) {
                reject(new Error('request to ' + url + ' failed, status code = ' + res.statusCode + ' (' + res.statusMessage + ')'));
                return;
            }

            var file = fs.createWriteStream(dest);
            file.on('finish', function () {
                // close() is async, call resolve after close completes.
                file.close(resolve);
            });
            file.on('error', function (err) {
                // Delete the file async. (But we don't check the result)
                fs.unlink(dest);
                reject(err);
            });

            res.pipe(file);
        })
            .on('error', function (err) {
                reject(err);
            })
            .end();
    });
}