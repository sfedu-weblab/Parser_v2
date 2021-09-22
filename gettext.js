const pdfText = require('pdf-text')

const pathToPdf = __dirname + '/pdf2.pdf'

pdfText(pathToPdf, function (err, chunks) {
  const fs = require('fs')
  const buffer = fs.readFileSync(pathToPdf)
  pdfText(buffer, function (err, chunks) {
    fs.writeFileSync('st.txt', chunks.join(' '))
  })
})