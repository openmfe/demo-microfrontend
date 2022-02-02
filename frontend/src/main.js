class HotelOffers extends HTMLElement
{
    static get observedAttributes() {
        return ["region"]
    }

    constructor() {
        super()
        this._shadow = this.attachShadow({ mode: "open" })
        this._shadow.innerHTML = this.innerHTML // retain skeleton until data is fetched

        // data from API
        this._data = {}

        // attributes
        this._attr = {}
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (newValue && oldValue !== newValue) {
            this._attr[name] = newValue

            if (this._attr.region) {
                await this._fetchData()
                this._render()
            }
        }
    }

    async _render() {
        this._shadow.innerHTML = `
            <style>
                *                   { font-family: "hotel-offers_nunito", Arial, sans-serif; font-display: swap; font-size: 14px; }
                .main               { all: initial; display: block; overflow: hidden; }
                .card               { border: 1px solid #3b97c2; border-radius: 5px; padding: 10px; max-width: 250px;
                                      float: left; margin: 0 20px 20px 0 }
                .card:last-child    { margin: 0 }
                h3                  { margin: 0 0 1rem; font-size: 20px; height: 45px }
                .img                { width: 250px; height: 187px }
                img                 { width: 100%; height: auto; }
                .desc               { margin: 2rem 0 1rem; }
                .desc p             { margin: 0.4rem; }
                button              { padding: 1rem 2rem; border: 1px solid #328c16; background: #72e74d; cursor: pointer }
                button:hover        { border-color: #256312; background: #5bc23b }
                .preview            { display: none; position: fixed; top: 0; left: 0; height: 100%; width: 100%;
                                      align-items: center; justify-content: center; background: #00000066  }
                .preview.on         { display: flex }
                .preview img        { max-width: 90%; max-height: 90% }
            </style>

            <div class=main>
                ${Object.values(this._data).map(hotel => `
                    <div class=card data-hotel=${hotel.id}>
                        <h3>${hotel.name}</h3>
                        <div class=img>
                            <img src="${hotel.image.small}" width=250 height=187 alt="Image of ${hotel.name}">
                        </div>

                        <div class=desc>
                            <p><strong>
                                ${"Example offer: %price%"
                                    .replace("%price%", new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(hotel.offer.price))}
                            </strong></p>
                            <p>
                                ${"From %start% to %end%"
                                    .replace("%start%", hotel.offer.startDate)
                                    .replace("%end%", hotel.offer.endDate)}
                            </p>
                        </div>

                        <button class=button>Add to wishlist</button>

                        <div class="preview">
                            <img src="" alt="">
                        </div>
                    </div>
                `).join('')}
            </div>
        `

        // attach card events
        this._shadow.querySelectorAll(".card").forEach(card => {
            const id = card.getAttribute("data-hotel")
            const hotel = this._data[id]
            const preview = card.querySelector(".preview")
            preview.img = preview.querySelector("img")

            const eventData = {
                id: hotel.id,
                name: hotel.name,
                image: hotel.image.small
            }

            preview.addEventListener("click", e => {
                preview.classList.remove("on")
                this._emitEvent("preview-closed", eventData, true)
            })

            card.querySelector("img").addEventListener("click", e => {
                preview.img.src = hotel.image.large
                preview.classList.add("on")
                this._emitEvent("preview-opened", eventData, true)
            })

            card.querySelector("button").addEventListener("click", e => {
                this._emitEvent("add-to-wishlist", eventData)
            })
        })
    }

    async _fetchData() {
        this._data = {}

        const response = await fetch(`__BACKEND_URL__/api?region=${this._attr.region}`)
        const data = await response.json()

        // remapping to object so we can access hotels by ID easily
        data.forEach(hotel => this._data[hotel.id] = hotel)
    }

    _emitEvent(name, data, tracking = false) {
        name = `hotel-offers.${name}`

        if (tracking) {
            data = {
                origin: this,
                name,
                data
            }

            name = 'openmfe.tracking'
        }

        this.dispatchEvent(new CustomEvent(name, {
            detail: data,
            bubbles: true,
            composed: true
        }))
    }
}

const loadFont = (style, weight) => {
    const font = new FontFace(
        `hotel-offers_nunito`,
        `url(__FRONTEND_URL__/fonts/nunito-${style}-${weight}.woff2)`,
        { style, weight }
    )

    font.display = "swap"

    font.load().then(fontface => document.fonts.add(fontface))
}

const fonts = [
    [ "normal", 400 ],
    [ "normal", 700 ]
]

fonts.forEach(font => loadFont(...font))

customElements.define('hotel-offers', HotelOffers)
