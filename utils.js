var fs = require('fs');

exports.json2String = json => JSON.stringify(json, null, 2)

exports.string2File = (content, filePath) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, function (err) {
            if (err) {
                console.log(filePath, "not saved. Error:", err);
                reject()
            } else {
                console.log(filePath, "saved")
                resolve()
            }
        })
    })
}

exports.removeExtraSpaces = str => str.trim().replace(/\s\s+/, ' ')

exports.removeSmallWords = str => str.replace(/\W*\b\w{1,2}\b/g, '');

exports.removeWords = (str, wordsToRemove) => exports.removeExtraSpaces(str.replace(new RegExp("\\b" + wordsToRemove.join('|\\b'), 'gi'), ''))