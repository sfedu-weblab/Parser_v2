const fs = require('fs');
const pdf = require('pdf-parse');


const ParseTxtFrom = (in__dir, out__dir) => {
	let dataBuffer = fs.readdirSync(in__dir);
	
	dataBuffer.forEach(file_name_extend => {
	
		filedata = fs.readFileSync(in__dir + file_name_extend)	
		pdf(filedata).then(function(data, err) {

			if (err) console.log(err);

			console.log(`\n\nParse file №${dataBuffer.indexOf(file_name_extend) + 1}`)

			console.log(`Number of pages: ${data.numrender}`)

			let result = data.text.replace(/-\n/gi, "")

			fs.writeFileSync(out__dir +'metadata/' + file_name_extend.replace('.pdf', '') + '.txt', JSON.stringify(data.info))

			fs.writeFileSync(out__dir +'content/' + file_name_extend.replace('.pdf', '') + '.txt', result)

			console.log('Completed')
				
		});


	});
	
}


const in__dir = '../storage/science-articles/pdf/'

const out__dir = '../storage/science-articles/txt/'

ParseTxtFrom(in__dir, out__dir)

