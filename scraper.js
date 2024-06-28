const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const proxyChain = require('proxy-chain');
const fs = require('fs');

// puppeteer.use(StealthPlugin());

const proxy = 'http://hunterknott00_gmail_com-country-any-sid-s6px3bwta7h-filter-medium:pc2dwa5j54@gate.nodemaven.com:8080'

const main = async () => {
    // const newProxyUrl = await proxyChain.anonymizeProxy(proxy);

    // console.log(newProxyUrl);

    const browser = await puppeteer.launch({
        headless: false,
        // args: [`--proxy-server=${newProxyUrl}`],
    });

    // puppeteer.launch({ headless: false }).then(async browser => {
    const page = await browser.newPage()
    const keyword = 'dentist+utah';
    await page.goto(`https://www.google.com/maps/search/dentist+utah/`);
//   })

  await page.evaluate(async () => {
    const searchResultsSelector = 'div[role="feed"]'
    const wrapper = document.querySelector(searchResultsSelector);

    await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 1000;
        var scrollDelay = 3000;

        var timer = setInterval(async () => {
            var scrollHeightBefore = wrapper.scrollHeight;
            wrapper.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeightBefore) {
                totalHeight = 0;
                await new Promise((resolve) => setTimeout(resolve, scrollDelay));

                var scrollHeightAfter = wrapper.scrollHeight;

                if (scrollHeightAfter > scrollHeightBefore) {
                    return;
                } else {
                    clearInterval(timer);
                    resolve()
                }
            }
        }, 200);
    });
  });

  const results = await page.evaluate(() => {
    const items = Array.from(
        document.querySelectorAll('div[role="feed"] > div > div[jsaction]')
    );

    return items.map((item) => {
        let data = {}

        try {
            data.title = item.querySelector(".fontHeadlineSmall").textContent;
        } catch (error) {}
        
        try {
            data.link = item.querySelector("a").getAttribute("href");
        } catch (error) {}

        try {
            data.website = item
                .querySelector('[data-value="Website"]')
                .getAttribute("href");
        } catch (error) {}

        try {
            const textContent = item.innerText;
            const phoneRegex = /((\+?\d{1,2}[ -]?)?(\(?\d{3}\)?[ -]?\d{3,4}[ -]?\d{4}|\(?\d{2,3}\)?[ -]?\d{2,3}[ -]?\d{2,3}[ -]?\d{2,3}))/g;

            const matches = [...textContent.matchAll(phoneRegex)];
            let phoneNumbers = matches
                .map((match) => match[0])
                .filter((phone) => (phone.match(/\d/g) || []).length >= 10);

            let phoneNumber = phoneNumbers.length > 0 ? phoneNumbers[0] : null;
            if (phoneNumber) {
                phoneNumber = phoneNumber.replace(/[ -]/g, "");
            }

            data.phone = phoneNumber;
        } catch (error) {}

        try {
            const addressElement = item.querySelector('button[data-item-id="address"] .Io6YTe.fontBodyMedium');
            data.address = addressElement ? addressElement.textContent : null;
          } catch (error) {}

        return data;
    });
  });

//   const filteredResults = 

  fs.writeFileSync("result.json", JSON.stringify(results, null, 2));

  console.log("Done")

  await browser.close();
}

main()