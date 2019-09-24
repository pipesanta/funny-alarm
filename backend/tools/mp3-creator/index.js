const googleTTS = require('google-tts-api');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const urlParse = require('url').parse;
const { defer } = require('rxjs');



function createFilePromise(name, content, lang = 'ES') {
    return new Promise(function (resolve, reject) {
        googleTTS(content, lang, 0.8)
            .then(function (url) {
                // console.log(url); // https://translate.google.com/translate_tts?...
                const route = __dirname.replace("tools/mp3-creator", "resources/mp3")
                var dest = path.resolve(route, `${name}.mp3`); // file destination
                resolve(downloadFile(url, dest));
            })
            .then(() => { })
            .catch(function (err) {
                console.error(err.stack);
                reject(err)
            });
    });
}

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

exports.createFile = (name, content, lang = 'ES') => {

    return new Promise(function (resolve, reject) {

        googleTTS(content, lang, 0.8)
            .then(function (url) {
                // console.log(url); // https://translate.google.com/translate_tts?...
                const route = __dirname.replace("tools/mp3-creator", "resources/mp3")
                var dest = path.resolve(route, `${name}.mp3`); // file destination
                resolve(downloadFile(url, dest));
            })
            .then(() => { })
            .catch(function (err) {
                console.error(err.stack);
                reject(err)
            });
    });

}

exports.multiple = () => {
    return Promise.all([
        createFilePromise('1', 'contenido del 1'),
        createFilePromise('2', 'contenido del 2'),
        createFilePromise('3', 'contenido del 3'),
        createFilePromise('4', 'contenido del 4'),
        createFilePromise('5', 'contenido del 5'),
        createFilePromise('6', 'contenido del 6'),
        createFilePromise('7', 'contenido del 7'),
        createFilePromise('8', 'contenido del 8'),
        createFilePromise('9', 'contenido del 9'),
        createFilePromise('10', 'contenido del 10'),
        createFilePromise('11', 'contenido del 11'),
        createFilePromise('12', 'contenido del 12'),
        
    ])
}