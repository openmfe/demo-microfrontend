const data = require('./data.js')

module.exports = async function({ region })
{
    const hotels = await data({ region })

    // useful for performance checks to simulate the response time delay of the original API
    if (process.env.MFE_BACKEND_DELAY) {
        await new Promise(r => setTimeout(r, process.env.MFE_BACKEND_DELAY))
    }

    return hotels.map(hotel => ({
        id : hotel.giataId,
        name : hotel.name,
        region: hotel.regionName,
        image : hotel.image,
        category: hotel.category,
        offer: {
            price: hotel.bestOffer.price,
            startDate: hotel.bestOffer.travelPeriod.startDate,
            endDate: hotel.bestOffer.travelPeriod.endDate
        }
    }))
}
