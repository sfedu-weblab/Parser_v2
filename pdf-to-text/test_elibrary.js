const puppeteer = require('puppeteer');
const fs = require('fs');
const {dir__path, PARSE_OPTIONS} = require('./const');



(async () => {

    const cache = fs.readdirSync('../cache/');

    console.log(cache)

    const reload_links = []

    for (let index = 0; index < cache.length; index++) {
        const dataBuffer = fs.readdirSync('../cache/' + cache[index])
        const links = await dataBuffer.map((file) => {
            const links = fs.readFileSync('../cache/'+ cache[index] + '/' + file , 'utf-8')
            let final_links = links.split(',')
    
            return final_links
                    
        });

        
        reload_links.push(await links.flat())

    }
    

    const final_links= await reload_links.flat()

    

    console.log(final_links.length)


    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    // await page.setDefaultNavigationTimeout(300000)
    // await page.goto("https://www.elibrary.ru/")

    // await page.type('#login', 'dsidorenko', { delay: 100 });
    // await page.type('#password', '123456qwe', { delay: 100 });
    // await page.click('.butred')

    // await page.waitForNavigation()

    let lol = 0;
    for (let index = fs.readdirSync('../storage/content').length; index < final_links.length; index++) {
        try {
            await page.goto("https://www.elibrary.ru" + final_links[index], {waitUntil: 'networkidle0'})

            const cache_x = fs.readdirSync('../cache/')
            const dataXBuffer = fs.readdirSync('../cache/' + cache_x[0])

            const stat = fs.statSync('../cache/' + cache_x[0] + '/' + dataXBuffer[0])
            let cont;
            let num;

            if (stat.size === 0) {
                fs.unlinkSync('../cache/' + cache_x[0] + '/' + dataXBuffer[0])
                cont = fs.readFileSync('../cache/' + cache_x[0] + '/' + dataXBuffer[1]).toString().split(','); // read file and convert to array by line break
                num = 1;
            }
            else{ 
                cont = fs.readFileSync('../cache/' + cache_x[0] + '/' + dataXBuffer[0]).toString().split(',');
                num = 0;
            } // read file and convert to array by line break

            

            cont.shift(); // remove the the first element from array
            cont = cont.join(','); // convert array back to string

            fs.writeFileSync('../cache/' + cache_x[0] + '/' + dataXBuffer[num], cont)


            const data = await page.evaluate(() => {
                let a = $('tr div#abstract1').children('p[align="justify"]')[0].innerText
    
                // let data = `${a}<SPLIT>${keywords}`
        
                return a
            })
    
            const keywords = await page.evaluate(() => {
    
                let keywords = $('a').filter((index, keyword) => keyword.toString().match(/keyword_items.asp/)).map((index, keyword) => keyword.innerText.toLowerCase())
        
                return keywords
            })

            let new_key = []
        for (let index = 0; index < keywords.length; index++) {
            new_key.push(keywords[index])
            
        }
        lol = lol + 1;
        console.log(lol)
    
    fs.writeFileSync(`${dir__path.output}/${index}.txt`, `${data}<SPLIT>${new_key}`)
            
        } catch (error) {
            // if (error.te instanceof ReferenceError) console.log(error)
            if(error.message.includes("ReferenceError")) {
                console.log(error)
                process.exit()
            }
            // cont = fs.readFileSync('../cache/dieFile').toString().split(',');

            // fs.writeFileSync('../cache/' + cache_x[0] + '/' + dataXBuffer[num], cont)
        }
    
    // if(index % 1000 === 0 ) await page.waitForTimeout(100000)
    // else if(index % 50 === 0 ) await page.waitForTimeout(10000)
    await page.waitForTimeout(500)



}

})()