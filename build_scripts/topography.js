const texturePacker = require('free-tex-packer-core')
const fs = require('fs')

let images = []
let topography_path
if (fs.existsSync(process.argv[2])) {
  topography_path = process.argv[2]
} else
  throw new Error('Topography path not found')

fs.readdirSync(topography_path).forEach(file => {
  console.log(file)
  images.push({ path: file, contents: fs.readFileSync(topography_path + '/' + file) })
})

options = {
  textureName: 'topography',
  removeFileExtension: true,
  prependFolderName: false,
  exporter: 'JsonHash',
  width: 2048,
  height: 2048,
  fixedSize: false,
  padding: 1,
  allowRotation: false,
  allowTrim: true,
  detectIdentical: true,
  packer: 'MaxRectsBin',
  packerMethod: 'BottomLeftRule'
}

texturePacker(images, options, (files, error) => {
  if (error) {
    console.error('Packaging failed', error)
  } else {
    for (let item of files) {
      console.log(item.name, item.buffer)
      fs.writeFileSync(topography_path + '/' + item.name, item.buffer)
    }
  }
})
