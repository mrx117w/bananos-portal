"use strict";

console.log("🔥 BANANOS PROMOS CLEAN CARGADO");

(() => {

    let lastData = null;

    function esc(value = "") {
        const el = document.createElement("div");
        el.textContent = String(value);
        return el.innerHTML;
    }


    function container() {
        return document.getElementById("promotionsContainer");
    }


    function render(promotions) {

        const box = container();

        if (!box) {
            console.error("❌ NO EXISTE promotionsContainer");
            return;
        }

        const promos = promotions
            .filter(p => p && p.active !== false)
            .slice(0, 3);


        console.log(
            "🔥 RENDER CLEAN:",
            promos
        );


        if (!promos.length) {

            box.innerHTML = `
                <div class="clean-empty">
                    <div>🍻</div>
                    <h2>PRÓXIMAMENTE</h2>
                    <p>Nuevas promociones en camino.</p>
                </div>
            `;

            return;
        }


        box.innerHTML = promos.map((p, i) => {

            const title = esc(p.title || "PROMOCIÓN");
            const description = esc(p.description || "");
            const price = esc(p.price || "");
            const image = String(p.image || "");

            return `
                <article class="clean-promo">

                    <div class="clean-promo-photo">

                        ${
                            image
                            ? `
                                <img
                                    src="${image}"
                                    alt="${title}"
                                >
                              `
                            : `
                                <div class="clean-no-image">
                                    🍻
                                </div>
                              `
                        }

                        <div class="clean-photo-shade"></div>

                        <span class="clean-number">
                            0${i + 1}
                        </span>

                    </div>


                    <div class="clean-promo-info">

                        <small>
                            ✦ PROMOCIÓN BANANOS
                        </small>

                        <h2>
                            ${title}
                        </h2>

                        ${
                            description
                            ? `<p>${description}</p>`
                            : ""
                        }

                        ${
                            price
                            ? `<strong>${price}</strong>`
                            : ""
                        }

                    </div>

                </article>
            `;

        }).join("");
    }


    async function load() {

        try {

            const response = await fetch(
                "/api/promotions?_=" + Date.now(),
                {
                    cache: "no-store"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "HTTP " + response.status
                );
            }

            const data = await response.json();

            console.log(
                "🔥 API CLEAN:",
                data
            );

            const json =
                JSON.stringify(data.promotions || []);

            /*
             * IMPORTANTE:
             * siempre podemos recuperar el contenido
             * aunque otro script viejo lo borre.
             */
            lastData =
                Array.isArray(data.promotions)
                ? data.promotions
                : [];

            render(lastData);

        }

        catch (error) {

            console.error(
                "❌ PROMOS CLEAN:",
                error
            );
        }
    }


    /*
     * PRIMERA CARGA
     */
    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            () => setTimeout(load, 700)
        );

    } else {

        setTimeout(load, 700);
    }


    /*
     * CUANDO ABRES OFERTAS
     */
    document.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    '[onclick*="offersScreen"],' +
                    '[data-target="offersScreen"],' +
                    '[data-page="ofertas"]'
                )
            ) {

                console.log(
                    "🔥 ABRIENDO OFERTAS"
                );

                setTimeout(load, 100);
                setTimeout(load, 500);
                setTimeout(load, 1000);
            }

        },
        true
    );


    /*
     * REFRESCO
     */
    setInterval(load, 4000);


    window.BANANOS_CLEAN_PROMOS = load;

})();
