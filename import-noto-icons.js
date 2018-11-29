const fs = require("fs");
const path = require("path");
const EmojiData = require("mnasyrov-emoji-data");
const jsonIcons = require("./dist/icons.json");


const LOCAL_SVG_FOLDER = "./dist/svg";
const NOTO_SVG_FOLDER = "./node_modules/noto-emoji/svg";
const JSON_OUTPUT_FILE = "./dist/icons.json";

const importIcon = (emoji) => {
    if (!emoji.image) {
        return Promise.reject()
    }

    const sourceFile = path.join(
        __dirname,
        NOTO_SVG_FOLDER,
        getNotoSvgFileName(emoji.image)
    );
    const destFileName = emoji.image.replace(".png", ".svg");
    const destinationFile = path.join(__dirname, LOCAL_SVG_FOLDER, destFileName);

    return new Promise((resolve, reject) => {
        fs.access(sourceFile, fs.constants.R_OK, err => {
            if (!err) {
                fs.createReadStream(sourceFile).pipe(fs.createWriteStream(destinationFile));
                resolve({
                    name: emoji.name.toLowerCase(),
                    svg: destFileName
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

const getNotoSvgFileName = name => "emoji_u" + name.replace(".png", ".svg");

const importIcons = async () => {
    const emojisArray = [];
    const output = [];
    const allImports = []
    const emojis = EmojiData.all()
    for (e in emojis) {
        //if (e > 5) break;
        emojisArray.push(emojis[e]);
    }
    Promise.all(emojisArray.map(e => importIcon(e))).then(values => {
        saveJsonOutput(values.filter(v => !!v))
    })
}

importIcons()