const googleTTS = require('google-tts-api');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const urlParse = require('url').parse;


/**
 * 
 * @param {string} name el nombre del archivo   
 * @param {string} content el contenido del archivo
 * @param {string} lang el lenguaje del contenido del archivo
 */
function createFilePromise(name, content, lang = 'ES') {
    return new Promise(function (resolve, reject) {
        googleTTS(content, lang, 0.8)
            .then(function (url) {
                // console.log(url); // https://translate.google.com/translate_tts?...
                const route = __dirname.replace("tools/mp3-creator", "resources/mp3")
                var dest = path.resolve(route, `${name}.mp3`); // file destination
                return downloadFile(url, dest);
            })
            .then(() => resolve(name) )
            .catch(function (err) {
                console.error(err.stack);
                reject(err)
            });
    });
}

/**
 * 
 * @param {string} content 
 */
function splitContent(content){
    const contentByWords = content.trim().split(' ');
    const result = [ '' ];
    let wordIndex = 0;
    contentByWords.forEach(word => {
        const currentWordLength = result[wordIndex].length;
        if( (currentWordLength + word.length) < 200 ){
            result[wordIndex] = result[wordIndex] + ' ' + word 
        }else{
            wordIndex++;
            result[wordIndex] = '';
            result[wordIndex] = word;
        }
        result[wordIndex]
    });

    return result;
}

/**
 * 
 * @param {string} content el contenido del archivo que se va a partir 
 */
function splitContentV2(content){

    lenghtContent=content.length;
    let lenSplitText = Math.ceil(lenghtContent/200);
    var principalArray = new Array(lenSplitText);
    let splitContent = Array.from(content.split(""));
    let k = 0;
    for (let i=0; i<lenSplitText;i++){
        principalArray[i]=new Array(200);
        let j=0;
        for(j; j<200;j++){
            principalArray[i][j]=splitContent[k];
            k+=1; 
        }
    }
    
    return principalArray;
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
            .end(() => {
                return 
            });
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

exports.createTone = (name, content) => {
    const parts = splitContent(content);
    const name_parsed = name.trim(); // todo replace ' ' with _
    const filesToCreate = [];
    parts.forEach((part, i) => {
        filesToCreate.push( createFilePromise(`${name_parsed}_${i}`, part));
    });
    return Promise.all(filesToCreate);
}


