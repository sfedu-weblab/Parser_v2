const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const category = 'Смартфоны'
  const baseSite = "https://3dnews.ru/"
  const webSite = "https://3dnews.ru/tags/%D1%81%D0%BC%D0%B0%D1%80%D1%82%D1%84%D0%BE%D0%BD"
  const linkGetter = ".entry-header"
  const readGetter = '.js-mediator-article'
  const pageValid = '/page-{{PAGE}}.html'

  let pageNow = 2

  const pageNeed = 50

  fs.mkdirSync('storage/' + category, { recursive: true })

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  for(let j = pageNow; j <= pageNeed; j++) {

    await page.goto(webSite + '/' + pageValid.replace("{{PAGE}}", j.toString()));

    const data = await page.evaluate((linkGetter) => Array.from(document.querySelectorAll(linkGetter), (element) => {
      return element.getAttribute('href').substr(1)
    }), linkGetter)
    console.log(data)

    for (let i = 0; i < data.length; i++) {
      await page.goto(baseSite + data[i])

      const content = await page.evaluate((readGetter) => {
        return document.querySelector(readGetter)?.innerText
      }, readGetter)

      if( content ) {
        fs.writeFileSync('storage/' + category + '/' + data[i], content)
      }
    }

    console.log('Page ' + pageNow + " completed")
  }
  await browser.close();
})();