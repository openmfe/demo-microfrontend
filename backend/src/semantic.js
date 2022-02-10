const data = require('./data.js')

module.exports = async function({ region })
{
    const hotels = await data({ region })

    return {
        "@context": "http://schema.org",
        "@graph": hotels.map(hotel => ({
            "@type" : "Hotel",
            "@id": hotel.code,
            name: hotel.title,
            starRating: hotel.category,
            telephone: hotel.phone,
            description: hotel.description,
            geo: {
                "@type" : "GeoCoordinates",
                ...hotel.coordinates
            }
        }))
    }
}
