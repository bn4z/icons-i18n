const fs = require('fs')
const path = require('path')

const LOCAL_SVG_FOLDER = './dist/svg'
const FA_IDENTIFICATION_STRING = 'Font Awesome'

const updateIcon = (filePath, fileName) => {
  if (!filePath || !fileName) {
    return Promise.reject()
  }

  const file = path.join(__dirname, filePath, fileName)

  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', function (err, data) {
      if (!err) {
        if (isFaIcon(data) && canBeUpdate(data)) {
          const newData = updateFaContent(data)
          fs.writeFile(file, newData, 'utf-8', err => {
            if (err) {
              console.log('Could update content of', file, 'Error:', err)
              resolve()
            } else {
              console.log(file, 'update')
              resolve({
                fileName
              })
            }
          })
        }
      } else {
        console.log('Could not access', file)
        resolve()
      }
    })
  })
}

const isFaIcon = svgContent => {
  const regex = /Font Awesome/gm
  return regex.test(svgContent)
}

const canBeUpdate = svgContent => {
  const regex = /<path d="/gm
  return regex.test(svgContent)
}

const updateFaContent = svgContent => {
  const regex = /<path d=/gm
  const subst = `<path fill="#fff" d=`
  return svgContent.replace(regex, subst)
}

const updateIcons = async () => {
  const icons = fs.readdirSync(LOCAL_SVG_FOLDER)

  const importPromises = []
  icons.map(fileName =>
    importPromises.push(updateIcon(LOCAL_SVG_FOLDER, fileName))
  )

  Promise.all(importPromises).then(values => {
    // Save entries except the null ones
    saveJsonOutput(values.filter(v => !!v))
  })
}

updateIcons()
