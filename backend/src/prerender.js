const juice = require('juice')
const minify = require("html-minifier-terser").minify

module.exports = async function({ region })
{
    const html = juice(`
            <style>
                .main               { all: initial; display: block; overflow: hidden; }
                .card               { border: 1px solid #aaa; border-radius: 5px; padding: 10px; max-width: 250px;
                                      float: left; margin: 0 20px 20px 0; }
                .card:last-child    { margin: 0 }
                .h1                 { margin: 0 0 1rem; height: 45px; background: #ddd; }
                .img                { width: 250px; height: 187px; color: #fff; display: flex; flex-direction: column;
                                      align-items: center; justify-content: center; background: #ddd; }
                svg                 { width: 50px; height: 50px; margin-bottom: 15px; }
                .offer              { margin: 2rem 0 1rem; height: 39px; background: #ddd; }
                .button             { display: inline-block; padding: 1rem 2rem; background: #ddd; width: 120px; height: 19px }
            </style>

            <div class=main>
                ${[1,2,3].map(x => `
                    <div class=card>
                        <div class=h1></div>

                        <div class=img>
                            <!-- animation from https://codepen.io/nikhil8krishnan/pen/rVoXJa -->
                            <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="44" fill="none" stroke="#fff" stroke-width="4" opacity=".5"/>
                                <circle cx="8" cy="54" r="6" fill="#fff" stroke="#ddd" stroke-width="3">
                                    <animateTransform attributeName="transform" dur="2s" from="0 50 48" repeatCount="indefinite" to="360 50 52" type="rotate"/>
                                </circle>
                            </svg>
                            LOADING
                        </div>

                        <div class=offer></div>

                        <span class=button></span>
                    </div>
                `).join('')}
            </div>
    `)

    return await minify(html, {
            minifyJS: true,
            minifyCSS: true,
            removeComments: true,
            removeAttributeQuotes: true,
            collapseWhitespace: true
        })
}
