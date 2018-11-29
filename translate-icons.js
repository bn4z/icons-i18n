const fs = require('fs');
const dictionnary = require("./eng-fra.json");
const sourceIcons = require("./dist/icons.json");
const {
    removeExtraSpaces,
    json2String,
    string2File,
    removeSmallWords,
    removeWords,
    removeAccents
} = require("./utils")
const FR_ICONS_FILE = "dist/icons.fra.json"
const destIcons = require("./" + FR_ICONS_FILE);

const USELESS_WORDS = ['des', 'sur', 'par', 'des', 'les', 'ces', 'ses', 'mes', 'mon', 'avec', 'qui', 'chez', 'parmi', 'tous', 'être', 'rendre']

const getDictionaryElement = en => dictionnary.find(word => word.en === en) || {}
const getTranslations = en => getDictionaryElement(en).fr || [en] //return the english word if no translation is found
const toSpaceSeparatedString = array => array.join(' ')
const translate = words => words.split(' ').map(w => toSpaceSeparatedString(getTranslations(w))).join(' ')
const removeUselessWords = str => removeWords(str, USELESS_WORDS)

const translateIconList = () => {

    sourceIcons.forEach((icon, index) => {
        //console.log(i)
        const exists = !!destIcons.find(x => x.svg === icon.svg)
        if (!exists) {
            destIcons.splice(index, 0, {
                //name: translate(i.name),
                name: removeExtraSpaces(removeAccents(removeUselessWords(removeSmallWords(translate(icon.name))))),
                svg: icon.svg
            })
        }
    })
    saveJsonFile(json2String(destIcons))
}

const saveJsonFile = jsonString => string2File(jsonString, FR_ICONS_FILE)

translateIconList()