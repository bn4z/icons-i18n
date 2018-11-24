# icons-i18n

## About

I primarily created these tools for another project where I need a list of icons with a description in french. I you have similar needs, the code can be easily adapted.

## Scripts

The project consists of three node.js scripts

- **import-icons** imports all svg icons from Google noto emoji that are listed in mnasyrov-emoji-data and generate a json file with icons descriptions in english.
- **create-json-dictionary** generates a json file with an array of english words and their translations in french using the open source English-French FreeDict Dictionary (http://freedict.org/).
- **translate-icons** translates the json with the list of icons from english to french using data collected with the two other scripts.
