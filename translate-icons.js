const fs = require('fs');
const dictionnary = require("./eng-fra.json");
const sourceIcons = require("./dist/icons.json");
const {
    removeExtraSpaces,
    json2String,
    string2File,
    removeSmallWords,
    removeWords
} = require("./utils")

const FR_ICONS_FILE = "dist/icons.fra.json"
const USELESS_WORDS = ['des', 'sur', 'par', 'des', 'les', 'ces', 'ses', 'mes', 'mon']

const getDictionaryElement = en => dictionnary.find(word => word.en === en) || {}
const getTranslations = en => getDictionaryElement(en).fr || [en] //return the english word if no translation is found
const toSpaceSeparatedString = array => array.join(' ')
const translate = words => words.split(' ').map(w => toSpaceSeparatedString(getTranslations(w))).join(' ')
const removeUselessWords = str => removeWords(str, USELESS_WORDS)

const translateIconList = () => {
    //console.log(icons)
    const frIcons = sourceIcons.map(i => {
        //console.log(i)
        return {
            name: removeExtraSpaces(removeUselessWords(removeSmallWords(translate(i.name)))),
            svg: i.svg
        }
    })
    saveJsonFile(json2String(frIcons))
}

const saveJsonFile = jsonString => string2File(jsonString, FR_ICONS_FILE)

translateIconList()