const fs = require("fs");
const path = require("path");
const jsonIcons = require("./dist/icons.json");

const LOCAL_SVG_FOLDER = "./dist/svg";
const FA_BRAND_SVG_FOLDER = "./node_modules/@fortawesome/fontawesome-pro/svgs/brands";
const FA_REGULAR_SVG_FOLDER = "./node_modules/@fortawesome/fontawesome-pro/svgs/regular";
const JSON_OUTPUT_FILE = "./dist/icons.json";

const importIcon = (filePath, fileName) => {
    if (!filePath || !fileName) {
        return Promise.reject()
    }

    const sourceFile = path.join(
        __dirname,
        filePath,
        fileName
    );

    const destinationFile = path.join(__dirname, LOCAL_SVG_FOLDER, fileName);

    return new Promise((resolve, reject) => {
        fs.access(sourceFile, fs.constants.R_OK, err => {
            if (!err) {
                fs.createReadStream(sourceFile).pipe(fs.createWriteStream(destinationFile));
                resolve({
                    name: fileName.replace(/-/g, ' ').replace('.svg', ''),
                    svg: fileName
                })
            } else {
                console.log("Could not access", sourceFile)
                resolve()
            }
        });
    })
}


const saveJsonOutput = (jsonArray) => {
    const jsonOutputFile = path.join(__dirname, JSON_OUTPUT_FILE);
    let count = 0

    jsonArray.forEach(item => {
        if (!jsonIcons.find(ji => ji.svg === item.svg)) {
            jsonIcons.push(item)
            count++
        }
    })

    if (count === 0) {
        console.log("No change found. No entry added in", jsonOutputFile);
        return
    }

    const outputString = JSON.stringify(jsonIcons, null, 2)
    fs.writeFile(jsonOutputFile, outputString, "utf8", () => {
        console.log(count, "entries added in", jsonOutputFile);
    });
}


const importIcons = async () => {
    const brandIcons = fs.readdirSync(FA_BRAND_SVG_FOLDER)
    const regularIcons = fs.readdirSync(FA_REGULAR_SVG_FOLDER)

    const importPromises = []
    brandIcons.map(fileName => importPromises.push(importIcon(FA_BRAND_SVG_FOLDER, fileName)))
    regularIcons.map(fileName => importPromises.push(importIcon(FA_REGULAR_SVG_FOLDER, fileName)))

    Promise.all(importPromises).then(values => {
        //Save entries except the null ones
        saveJsonOutput(values.filter(v => !!v))
    })
}

importIcons()