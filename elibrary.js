const puppeteer = require('puppeteer')
const fs = require('fs');

async function autoScroll(page){
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight){
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

/**
 * ИНФОРМАЦИОННАЯ БЕЗОПАСНОСТЬ	15385
 * МЕТОДЫ И СИСТЕМЫ ЗАЩИТЫ ИНФОРМАЦИИ, ИНФОРМАЦИОННАЯ БЕЗОПАСНОСТЬ	685
 * ИНФОРМАЦИОННАЯ БЕЗОПАСНОСТЬ ЛИЧНОСТИ	136
 * МЕЖДУНАРОДНАЯ ИНФОРМАЦИОННАЯ БЕЗОПАСНОСТЬ	129
 * ИНФОРМАЦИОННАЯ БЕЗОПАСНОСТЬ ДЕТЕЙ	76
 * ИНФОРМАЦИОННАЯ БЕЗОПАСНОСТЬ ПРЕДПРИЯТИЯ	57
 * ИНФОРМАЦИОННАЯ БЕЗОПАСНОСТЬ ГОСУДАРСТВА	22
 * НЕЙРОСЕТИ	457
 * ИСКУССТВЕННЫЕ НЕЙРОСЕТИ	22
 * ОБУЧЕНИЕ НЕЙРОСЕТИ	17
 * СВЕРТОЧНЫЕ НЕЙРОСЕТИ	15
 * РЕКУРРЕНТНЫЕ НЕЙРОСЕТИ	6
 * ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ	11864
 * ИГРОВОЙ ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ	18
 * СИЛЬНЫЙ ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ	38
 * РАСПРЕДЕЛЕННЫЙ ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ	13
 * ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ В ОБРАЗОВАНИИ	16
 * РОБОТОТЕХНИКА	3297
 * ОБРАЗОВАТЕЛЬНАЯ РОБОТОТЕХНИКА	546
 * МЕДИЦИНСКАЯ РОБОТОТЕХНИКА	56
 * ГРУППОВАЯ РОБОТОТЕХНИКА	54
 * СОЦИАЛЬНАЯ РОБОТОТЕХНИКА	48
 * МОБИЛЬНАЯ РОБОТОТЕХНИКА	36
 * ПОДВОДНАЯ РОБОТОТЕХНИКА	33
 * ПРОМЫШЛЕННАЯ РОБОТОТЕХНИКА	32
 * МАТЕМАТИКА	30120
 * ВЫЧИСЛИТЕЛЬНАЯ МАТЕМАТИКА	3002
 * ВЫСШАЯ МАТЕМАТИКА	1779
 * ЭЛЕМЕНТАРНАЯ МАТЕМАТИКА	1442
 * ПРИКЛАДНАЯ МАТЕМАТИКА	1351
 * ЕСТЕСТВЕННЫЕ НАУКИ. МАТЕМАТИКА	1171
 */
(async () => {
  const catName = 'Информационная безопасность'
  const catLink = 'https://www.elibrary.ru/keyword_items.asp?id=976642&show_option=0'
  const login = 'dsidorenko'
  const pass = '123456qwe'
  let pageNumber = 155

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(300000)
  await page.goto("https://www.elibrary.ru/")

  await page.type('#login', login, { delay: 100 });
  await page.type('#password', pass, { delay: 100 });
  await page.click('.butred')

  await page.waitForNavigation()
  await page.goto(catLink)
  await autoScroll(page);

  const data = await page.evaluate(() => {
    let a = $('#restab tr').children('td[align="left"]').children('a')

    let data = []
    for (let i=0; i<a.length; i++) {data.push($(a[i]).attr('href'))}

    return data
  })

  if(!fs.existsSync('cache/' + catName)) {
    await fs.mkdirSync('cache/' + catName)
  }
  await fs.writeFileSync('cache/' + catName + '/links0.txt', data.join(','))
  console.log('Page 1 parsed')

  for(let i = 1; i < pageNumber; i++) {
    await page.click('[title="Следующая страница"]')
    await page.waitForNavigation()
    await autoScroll(page)

    const data = await page.evaluate(() => {
      let a = $('#restab tr').children('td[align="left"]').children('a')

      let data = []
      for (let i=0; i<a.length; i++) {data.push($(a[i]).attr('href'))}

      return data
    })

    await fs.writeFileSync('cache/' + catName + '/links'+i+'.txt', data.join(','))
    console.log('Page '+(i+1)+' parsed')
    console.log('Timeout 10 seconds and next iteration')
    await page.waitForTimeout(10000)
  }
})()