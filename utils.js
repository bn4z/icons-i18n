var fs = require('fs');

const removeAccents = require('remove-accents-diacritics');

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

//Regex: match one or two characters length words. Words are a group of characters between (spaces, start, end).
//This regex also matches a sequence of two small words. Otherwise, if 2 small words are consecutive, the second one is not matched
exports.removeSmallWords = str => str.replace(/(?:^|\s)(\S{1,2})(\s(\S{1,2}))?(?:$|\s)/g, ' ');

exports.removeWords = (str, wordsToRemove) => exports.removeExtraSpaces(str.replace(new RegExp('(?:^|\\s)' + wordsToRemove.join('(?:$|\\s)|'), 'gi'), ' '))

exports.removeAccents = removeAccents.remove