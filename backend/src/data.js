const fetch = require("node-fetch")
const offerUrlTpl = "https://www.tui.com/api/hotel?searchScope=PACKAGE&departureAirports[]=BRU&departureAirports[]=CGN&departureAirports[]=DUS&startDate=2022-05-01&endDate=2022-07-31&duration=5-8&travellers[0][adults]=2&earlyBird=true&ratings=0&recommendationRate=0&sortHotelsField=popularity&sortHotelsAsc=false&regionId=__REGION__&language=de&fetchSize=3"
const imgBaseUrl = "https://pics.tui.com/pics"
const cache = new Map()
const fs = require('fs')

module.exports = async function({ region })
{
    if (!region || !region.match(/^\d+$/))
        throw new Error("Invalid request!")

    let hotels
    const cacheFile = `${__dirname}/../.cache/${region}.json`

    if (fs.existsSync(cacheFile)) {
        hotels = JSON.parse(fs.readFileSync(cacheFile))
    } else {
        const url = offerUrlTpl.replace("__REGION__", region)

        const response = await fetch(url, {
            cache: "no-cache",
            headers: { "Content-Type": "application/json" }
        })

        if (response.status !== 200) {
            throw new Error(`Error: ${JSON.stringify(response)}`)
        }

        hotels = (await response.json()).hotels.map(hotel => {
            hotel.image = {
                small : `${imgBaseUrl}/pics400x300/${hotel.thumbnail}`,
                large: `${imgBaseUrl}/pics1600x1200/${hotel.thumbnail}`
            }

            return hotel
        })

        fs.writeFileSync(cacheFile, JSON.stringify(hotels))
    }

    return hotels
}
