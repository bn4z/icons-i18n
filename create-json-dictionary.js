const https = require('https');
const fs = require('fs');
const path = require('path')
const parseString = require('xml2js').parseString;
const MemoryStream = require('memorystream');
const {
    json2String,
    string2File
} = require("./utils")

const LANG_FILE = "eng-fra.json"

const localXmlFile2Json = () => {
    console.log("Translate from eng-fra.xml")
    fs.readFile('eng-fra.xml', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        xml2Json(data).then(json => saveJsonFile(json2String(simplifyJson(json))))
    })
}

const xml2Json = xmlString => {
    return new Promise((resolve, reject) => {
        parseString(xmlString, function (err, result) {
            if (!err) {
                resolve(result)
            } else {
                reject(err)
            }
        })
    })
}

const simplifyJson = json => {
    console.log("Extracting words from English-French FreeDict Dictionary (http://freedict.org/)")
    const contentArray = json.TEI.text[0].body[0].entry
    const output = contentArray.map(word => {
        return {
            en: word.form[0].orth[0].toLowerCase(),
            fr: getTranslationList(word)
        }
    })
    return output
}

const getTranslationList = word => word.sense.reduce((senseAcc, sense) => [...senseAcc, ...sense.cit.reduce((citAcc, cit) => [...citAcc, cit.quote[0].toLowerCase()], [])], [])

const saveJsonFile = jsonString => string2File(jsonString, LANG_FILE)


const importOnlineDictionary = () => {
    fs.access(LANG_FILE, fs.constants.F_OK, err => {
        if (!err) {
            console.log("No need to download")
        } else {
            console.log("Downloading dictionary file...")
            var file = fs.createWriteStream(LANG_FILE);
            var memStream = new MemoryStream(null, {
                readable: false
            });
            var request = https.get("https://raw.githubusercontent.com/freedict/fd-dictionaries/master/eng-fra/eng-fra.tei", function (response) {
                response.pipe(memStream);
                response.on('end', function () {
                    xml2Json(memStream.toString()).then(json => saveJsonFile(json2String(simplifyJson(json))))
                });
            });
        }
    });
}

//localXmlFile2Json()
importOnlineDictionary()