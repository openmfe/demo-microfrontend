const backend = require('./backend.js')

module.exports = async function({ region })
{
    const data = await backend({ region })

    return {
        "@context": "http://schema.org",
        "@graph": data.map(hotel => ({
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
