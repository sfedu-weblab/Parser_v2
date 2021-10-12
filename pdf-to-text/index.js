const fs = require('fs');
const pdf = require('pdf-parse');

const {dir__path, PARSE_OPTIONS} = require('./const')


const ParseTxtFrom = (in__dir, out__dir, options) => {
	let dataBuffer = fs.readdirSync(in__dir);
	
	dataBuffer.forEach(file_name_extend => {
	
		filedata = fs.readFileSync(in__dir + file_name_extend)	
		pdf(filedata, options).then(function(data, err) {

			if (err) console.log(err);

			console.log(`\n\nParse file №${dataBuffer.indexOf(file_name_extend) + 1}`)

			console.log(`Number of pages: ${data.numrender}`)

			console.log(`Filename: ${file_name_extend}`)

			let result = data.text.replace(/-\n/gi, "")


			fs.writeFileSync(out__dir +'metadata/' + file_name_extend.replace('.pdf', '') + '.txt', JSON.stringify(data.info))

			fs.writeFileSync(out__dir +'content/' + file_name_extend.replace('.pdf', '') + '.txt', result)

			console.log('Completed')
				
		});


	});
	
}


ParseTxtFrom(dir__path.input, dir__path.output, PARSE_OPTIONS)

