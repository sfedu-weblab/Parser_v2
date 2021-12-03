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

    final_links.forEach(element => {
        console.log(element)
    });

    console.log(final_links.length)


    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    for (let index = 0; index < final_links.length; index++) {
        await page.goto("https://www.elibrary.ru" + final_links[index], {waitUntil: 'networkidle0'})

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

        console.log(new_key)

    

    fs.writeFileSync(`${dir__path.output}/content/${index}.txt`, `${data}<SPLIT>${new_key}`)

    await page.waitForTimeout(5000)



}

})()