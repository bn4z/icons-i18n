# icons-i18n

## About

These tools were primarily created for another project where a list of icons with french keywords is needed. The code can be easily adapted to support other languages.

## Demo

![alt text](https://raw.githubusercontent.com/bn4z/icons-i18n/master/demo.gif)

## Scripts

The project consists of five node.js scripts

- **import-noto-icons** imports all svg icons from Google noto emoji that are listed in mnasyrov-emoji-data and generate a json file with icons descriptions in english.
- **import-fa-icons** imports all svg icons from Font-Awesome and generate a json file with icons descriptions in english. Here, Pro version of of Font-Awesome is used but it can be replaced with the free one.
- **create-json-dictionary** generates a json file with an array of english words and their translations in french using the open source English-French FreeDict Dictionary (http://freedict.org/).
- **translate-icons** translates the json with the list of icons from english to french using data collected with the other scripts. If the script is run twice, only missing elements will be added to the target file so it will preserve any manual edit done previously.
- **update-fa-icons-color** parses all Font Awesome SVG icon files and set the color to white if no fill color is defined.
