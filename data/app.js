/* ==========================================================
   BANANOS BAR
   PORTAL MOBILE V2
   ========================================================== */

"use strict";


/* ==========================================================
   ELEMENTOS
   ========================================================== */

const splash =
    document.getElementById("splash");

const app =
    document.getElementById("app");

const screens =
    document.querySelectorAll(".screen");

const navItems =
    document.querySelectorAll(".nav-item");



/* ==========================================================
   SPLASH
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * BANANOS FAST BOOT
         *
         * No esperamos window.load porque eso obliga
         * a esperar todas las imágenes del menú.
         */

        startApp();

        if (!splash) {
            return;
        }

        setTimeout(
            () => {

                splash.style.transition =
                    "opacity .22s ease, transform .22s ease";

                splash.style.opacity = "0";

                splash.style.transform =
                    "scale(1.025)";

                setTimeout(
                    () => {
                        splash.remove();
                    },
                    220
                );

            },
            450
        );

    }
);



function startApp() {

    if (app) {
        app.classList.remove("hidden");
    }

    showHome();

}



/* ==========================================================
   CAMBIAR PANTALLA
   ========================================================== */

function showPage(screenId) {

    const target =
        document.getElementById(screenId);

    if (!target) {

        console.error(
            "[BANANOS] Pantalla no encontrada:",
            screenId
        );

        return;
    }


    screens.forEach(
        screen => {

            screen.classList.remove("active");

        }
    );


    target.classList.add("active");


    updateNavigation(screenId);


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    animateScreen(target);

}



/* ==========================================================
   HOME
   ========================================================== */

function showHome() {

    showPage("homeScreen");

}



/* ==========================================================
   MENU PRINCIPAL
   ========================================================== */

function showMenu() {

    showPage("menuScreen");

}



/* ==========================================================
   CATEGORIAS
   ========================================================== */

function openCategory(category) {

    console.log(
        "[BANANOS] Abriendo categoría:",
        category
    );

    const categories = {
        "cerveza": "beerScreen",
        "whisky": "whiskyScreen",
        "ron": "ronScreen",
        "tequila": "tequilaScreen",
        "sin-alcohol": "zeroScreen",
        "snacks": "snacksScreen"
    };

    const screenId = categories[category];

    if (!screenId) {
        console.warn(
            "[BANANOS] Categoría desconocida:",
            category
        );
        return;
    }

    const target =
        document.getElementById(screenId);

    if (!target) {
        console.error(
            "[BANANOS] No existe la pantalla:",
            screenId
        );
        return;
    }

    showPage(screenId);

    setTimeout(() => {
        animateDrinkCards();
    }, 100);
}


/* ==========================================================
   NAVEGACION INFERIOR
   ========================================================== */

function updateNavigation(screenId) {

    navItems.forEach(
        item => {

            item.classList.remove("active");

        }
    );


    let targetNav = screenId;


    /*
       Las categorías pertenecen
       al apartado MENÚ.
    */

    const menuScreens = [

    "menuScreen",
    "beerScreen",
    "whiskyScreen",
    "ronScreen",
    "tequilaScreen",
    "zeroScreen",
    "snacksScreen"

];


    if (
        menuScreens.includes(screenId)
    ) {

        targetNav = "menuScreen";

    }


    navItems.forEach(
        item => {

            if (
                item.dataset.target ===
                targetNav
            ) {

                item.classList.add("active");

            }

        }
    );

}



/* ==========================================================
   ANIMACION DE ENTRADA
   ========================================================== */

function animateScreen(screen) {

    if (!screen) return;


    screen.animate(
        [

            {
                opacity: 0,
                transform:
                    "translateY(14px)"
            },

            {
                opacity: 1,
                transform:
                    "translateY(0)"
            }

        ],
        {

            duration: 350,

            easing:
                "cubic-bezier(.2,.8,.2,1)"

        }
    );

}



/* ==========================================================
   CARDS BEBIDAS
   ========================================================== */

function animateDrinkCards() {

    const activeScreen =
        document.querySelector(
            ".screen.active"
        );


    if (!activeScreen) return;


    const cards =
        activeScreen.querySelectorAll(
            ".drink-card, .beer-item"
        );


    cards.forEach(
        (card, index) => {

            card.animate(
                [

                    {
                        opacity: 0,
                        transform:
                            "translateY(20px) scale(.98)"
                    },

                    {
                        opacity: 1,
                        transform:
                            "translateY(0) scale(1)"
                    }

                ],
                {

                    duration: 420,

                    delay:
                        Math.min(
                            index * 70,
                            500
                        ),

                    fill: "both",

                    easing:
                        "cubic-bezier(.2,.8,.2,1)"

                }
            );

        }
    );

}



/* ==========================================================
   FALLBACK PARA FOTOS
   ========================================================== */

function imageFallback(
    image,
    emoji
) {

    if (!image) return;


    const container =
        image.parentElement;


    if (!container) return;


    image.remove();


    const fallback =
        document.createElement("div");


    fallback.className =
        "image-fallback";


    fallback.textContent =
        emoji || "🍹";


    container.appendChild(
        fallback
    );

}



/* ==========================================================
   EFECTO TACTIL
   ========================================================== */

document.addEventListener(
    "pointerdown",
    event => {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) return;


        button.style.transition =
            "transform .12s ease";


        if (
            !button.classList.contains(
                "nav-item"
            )
        ) {

            button.style.transform =
                "scale(.97)";

        }

    }
);



document.addEventListener(
    "pointerup",
    event => {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) return;


        setTimeout(
            () => {

                button.style.transform =
                    "";

            },
            90
        );

    }
);



document.addEventListener(
    "pointercancel",
    () => {

        document
            .querySelectorAll("button")
            .forEach(
                button => {

                    button.style.transform =
                        "";

                }
            );

    }
);



/* ==========================================================
   PARALLAX HOME
   ========================================================== */

let ticking = false;


window.addEventListener(
    "scroll",
    () => {

        if (ticking) return;


        ticking = true;


        requestAnimationFrame(
            () => {

                const home =
                    document.getElementById(
                        "homeScreen"
                    );


                if (
                    home &&
                    home.classList.contains(
                        "active"
                    )
                ) {

                    const logo =
                        document.querySelector(
                            ".main-logo"
                        );


                    if (logo) {

                        const scroll =
                            Math.min(
                                window.scrollY,
                                500
                            );


                        logo.style.translate =
                            `0 ${scroll * .025}px`;

                    }

                }


                ticking = false;

            }
        );

    },
    {
        passive: true
    }
);



/* ==========================================================
   ANIMACION RANDOM DE BEBIDAS
   ========================================================== */

function randomizeFloatingDrinks() {

    const drinks =
        document.querySelectorAll(
            ".float-drink"
        );


    drinks.forEach(
        drink => {

            const duration =
                6500 +
                Math.random() * 5000;


            drink.style.animationDuration =
                `${duration}ms`;

        }
    );

}


randomizeFloatingDrinks();



/* ==========================================================
   ESCAPE EN PC
   ========================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        const active =
            document.querySelector(
                ".screen.active"
            );


        if (!active) return;


      const categoryScreens = [

    "beerScreen",
    "whiskyScreen",
    "ronScreen",
    "tequilaScreen",
    "zeroScreen",
    "snacksScreen"

];


        if (
            categoryScreens.includes(
                active.id
            )
        ) {

            showMenu();

            return;

        }


        if (
            active.id !==
            "homeScreen"
        ) {

            showHome();

        }

    }
);



/* ==========================================================
   PREVENIR IMAGENES ARRASTRABLES
   ========================================================== */

document.addEventListener(
    "dragstart",
    event => {

        if (
            event.target.tagName ===
            "IMG"
        ) {

            event.preventDefault();

        }

    }
);



/* ==========================================================
   DEBUG
   ========================================================== */

console.log(
    "%cBANANOS BAR",
    [
        "font-size:22px",
        "font-weight:900",
        "color:#ffd000",
        "background:#000",
        "padding:8px 12px"
    ].join(";")
);


console.log(
    "%cPORTAL MOBILE V2 ONLINE",
    "color:#43ff25;font-weight:bold;"
);
/* ==========================================================
   BANANOS BAR
   PROMOCIONES
   ========================================================== */

function promoFallback(image) {

    if (!image) {
        return;
    }

    const container =
        image.parentElement;

    if (!container) {
        return;
    }

    image.remove();

    const fallback =
        document.createElement("div");

    fallback.className =
        "promo-fallback";

    fallback.innerHTML = `
        <span>🍻</span>
        <small>PRÓXIMAMENTE</small>
    `;

    container.prepend(fallback);
}


/* ==========================================================
   ANIMAR PROMOCIONES
   ========================================================== */

function animatePromotions() {

    const cards =
        document.querySelectorAll(
            ".promotion-card"
        );

    cards.forEach(
        (card, index) => {

            card.animate(
                [
                    {
                        opacity: 0,
                        transform:
                            "translateY(35px) scale(.97)"
                    },

                    {
                        opacity: 1,
                        transform:
                            "translateY(0) scale(1)"
                    }
                ],
                {
                    duration: 550,

                    delay:
                        index * 120,

                    fill: "both",

                    easing:
                        "cubic-bezier(.2,.8,.2,1)"
                }
            );

        }
    );

}
/* ==========================================================
   BANANOS BAR
   SISTEMA DINÁMICO DE PROMOCIONES
   ========================================================== */


/*
    ESTA INFORMACIÓN ES TEMPORAL.

    Después será reemplazada por:

        fetch("/api/promotions")

    para obtenerla directamente
    desde el ESP32.

    El panel ADMIN modificará esos datos.
*/


const BANANOS_PROMOTIONS = [

    {
        id: 1,

        active: false,

        image: "",

        title: "",

        description: "",

        price: ""
    },


    {
        id: 2,

        active: false,

        image: "",

        title: "",

        description: "",

        price: ""
    },


    {
        id: 3,

        active: false,

        image: "",

        title: "",

        description: "",

        price: ""
    }

];


/* ==========================================================
   ESCAPAR TEXTO
   ========================================================== */

function escapePromoHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;
}


/* ==========================================================
   CREAR TARJETA
   ========================================================== */

function createPromotionCard(
    promo,
    position
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "dynamic-promo-card";


    const title =
        escapePromoHTML(
            promo.title
        );


    const description =
        escapePromoHTML(
            promo.description
        );


    const price =
        escapePromoHTML(
            promo.price
        );


    const image =
        escapePromoHTML(
            promo.image
        );


    const number =
        String(position + 1)
            .padStart(
                2,
                "0"
            );


    article.innerHTML = `

        ${
            image
            ?
            `
            <img
                class="dynamic-promo-image"
                src="${image}"
                alt="${title}"
            >
            `
            :
            ""
        }


        <div
            class="dynamic-promo-overlay"
        ></div>


        <div
            class="dynamic-promo-color"
        ></div>


        <div
            class="dynamic-promo-badge"
        >
            🔥 PROMOCIÓN
        </div>


        <div
            class="dynamic-promo-number"
        >
            ${number}
        </div>


        <div
            class="dynamic-promo-content"
        >

            <small>
                BANANOS BAR
            </small>


            <h2>
                ${title}
            </h2>


            ${
                description
                ?
                `
                <p>
                    ${description}
                </p>
                `
                :
                ""
            }


            ${
                price
                ?
                `
                <div
                    class="dynamic-promo-price"
                >
                    ${price}
                </div>
                `
                :
                ""
            }

        </div>

    `;


    return article;
}


/* ==========================================================
   SIN PROMOCIONES
   ========================================================== */

function renderNoPromotions(
    container
) {

    container.innerHTML = `

        <div
            class="no-promotions"
        >

            <div
                class="no-promotions-icon"
            >
                🍻
            </div>


            <small>
                BANANOS BAR
            </small>


            <h2>
                ESTAMOS PREPARANDO
                <span>
                    ALGO BUENO
                </span>
            </h2>


            <p>
                Muy pronto encontrarás
                aquí nuestras promociones
                disponibles.
            </p>

        </div>

    `;

}


/* ==========================================================
   MOSTRAR PROMOCIONES
   ========================================================== */

function renderPromotions(
    promotions =
        BANANOS_PROMOTIONS
) {

    const container =
        document.getElementById(
            "promotionsContainer"
        );


    if (!container) {

        console.warn(
            "[BANANOS] promotionsContainer no encontrado."
        );

        return;
    }


    /*
        SOLAMENTE MOSTRAMOS
        PROMOCIONES ACTIVAS
    */

    const activePromotions =
        promotions
            .filter(
                promo =>
                    promo &&
                    promo.active
            )
            .slice(
                0,
                3
            );


    container.innerHTML =
        "";


    /*
        NINGUNA ACTIVA
    */

    if (
        activePromotions.length === 0
    ) {

        renderNoPromotions(
            container
        );

        return;
    }


    /*
        GENERAR TARJETAS
    */

    activePromotions.forEach(
        (
            promo,
            index
        ) => {

            const card =
                createPromotionCard(
                    promo,
                    index
                );


            container.appendChild(
                card
            );


            /*
                ENTRADA ANIMADA
            */

            card.animate(

                [

                    {

                        opacity: 0,

                        transform:
                            "translateY(35px) scale(.97)"
                    },


                    {

                        opacity: 1,

                        transform:
                            "translateY(0) scale(1)"
                    }

                ],

                {

                    duration: 650,

                    delay:
                        index * 120,

                    fill:
                        "both",

                    easing:
                        "cubic-bezier(.2,.8,.2,1)"

                }

            );

        }
    );

}


/* ==========================================================
   INICIALIZAR
   ========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        // renderPromotions(); // DESACTIVADO - usa API

    }

);

/* ==========================================================
   BANANOS BAR
   PROMOCIONES EN VIVO V1
   Admin -> API -> Portal cliente
   ========================================================== */

async function bananosLoadLivePromotions() {

    console.log(
        "[BANANOS] Cargando promociones..."
    );

    try {

        const response = await fetch(
            "/api/promotions",
            {
                method: "GET",
                cache: "no-store"
            }
        );

        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }

        const data = await response.json();

        const promotions =
            Array.isArray(data.promotions)
                ? data.promotions.filter(
                    promo => promo.active !== false
                )
                : [];

        console.log(
            "[BANANOS] Promociones recibidas:",
            promotions
        );

        bananosRenderLivePromotions(
            promotions
        );

    }

    catch (error) {

        console.error(
            "[BANANOS] Error cargando promociones:",
            error
        );

    }

}


/* ==========================================================
   BUSCAR CONTENEDOR DE PROMOCIONES
   ========================================================== */

function bananosFindPromoContainer() {

    /*
       Buscamos varios nombres porque el portal
       fue construido por fases.
    */

    const selectors = [

        "#promotionsList",
        "#promosList",
        "#promoList",
        "#offersList",
        "#ofertasList",
        "#promotionsGrid",
        "#promosGrid",
        "#offersGrid",
        "#ofertasGrid",

        ".promotions-list",
        ".promos-list",
        ".offers-list",
        ".ofertas-list",

        ".promotions-grid",
        ".promos-grid",
        ".offers-grid",
        ".ofertas-grid"

    ];

    for (const selector of selectors) {

        const element =
            document.querySelector(selector);

        if (element) {

            console.log(
                "[BANANOS] Contenedor encontrado:",
                selector
            );

            return element;
        }

    }

    return null;
}


/* ==========================================================
   ESCAPAR TEXTO
   ========================================================== */

function bananosEscape(value = "") {

    return String(value)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ==========================================================
   RENDER PROMOCIONES
   ========================================================== */

function bananosRenderLivePromotions(
    promotions
) {

    let container =
        bananosFindPromoContainer();


    /*
       Si todavía no existe un contenedor
       dentro de la pantalla de ofertas,
       intentamos encontrar la pantalla.
    */

    if (!container) {

        const offersScreen =
            document.querySelector(
                "#promociones, " +
                "#promotions, " +
                "#ofertas, " +
                "#offers, " +
                '[data-page="promociones"], ' +
                '[data-page="ofertas"]'
            );


        if (offersScreen) {

            container =
                document.createElement("div");

            container.id =
                "bananosLivePromotions";

            container.className =
                "bananos-live-promotions";

            offersScreen.appendChild(
                container
            );

        }

    }


    if (!container) {

        console.warn(
            "[BANANOS] No encontré el contenedor de Ofertas."
        );

        return;
    }


    /*
       SIN PROMOCIONES
    */

    if (promotions.length === 0) {

        container.innerHTML = `

            <div class="bananos-no-promos">

                <span>✦</span>

                <h3>
                    Próximamente
                </h3>

                <p>
                    Estamos preparando nuevas
                    promociones para ti.
                </p>

            </div>

        `;

        return;
    }


    /*
       PROMOCIONES ACTIVAS
    */

    container.innerHTML =
        promotions
            .slice(0, 3)
            .map(
                (promo, index) => {

                    const title =
                        bananosEscape(
                            promo.title || "Promoción"
                        );

                    const description =
                        bananosEscape(
                            promo.description || ""
                        );

                    const image =
                        bananosEscape(
                            promo.image || ""
                        );

                    const price =
                        bananosEscape(
                            promo.price || ""
                        );


                    return `

                    <article
                        class="bananos-live-promo"
                        style="
                            animation-delay:
                            ${index * 100}ms;
                        "
                    >

                        <div
                            class="bananos-live-promo-image"
                        >

                            <img
                                src="${image}"
                                alt="${title}"
                                loading="lazy"
                            >

                            <div
                                class="bananos-promo-shade"
                            ></div>


                            <span
                                class="bananos-promo-badge"
                            >
                                PROMO
                            </span>


                            <span
                                class="bananos-promo-number"
                            >
                                0${index + 1}
                            </span>

                        </div>


                        <div
                            class="bananos-live-promo-content"
                        >

                            <span
                                class="bananos-promo-eyebrow"
                            >
                                OFERTA ESPECIAL
                            </span>


                            <h3>
                                ${title}
                            </h3>


                            <p>
                                ${description}
                            </p>


                            ${
                                price
                                ?
                                `
                                <strong
                                    class="bananos-promo-price"
                                >
                                    ${price}
                                </strong>
                                `
                                :
                                ""
                            }

                        </div>

                    </article>

                    `;

                }
            )
            .join("");

}


/* ==========================================================
   ACTUALIZACIÓN
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            bananosLoadLivePromotions,
            300
        );

    }
);


/*
   Cada vez que el usuario vuelve a la pestaña
   actualizamos las promociones.
*/

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            bananosLoadLivePromotions();

        }

    }
);


/*
   También refrescamos cada 15 segundos.
*/

/* PROMOS LEGACY INTERVAL DESACTIVADO */


console.log(
    "[BANANOS] Live Promotions V1 listo."
);


/* ==========================================================
   BANANOS BAR
   PROMOTIONS FINAL CONTROLLER V2
   API -> #promotionsContainer
   ========================================================== */

async function BANANOS_loadPromotionsFinal() {

    const container =
        document.getElementById(
            "promotionsContainer"
        );

    if (!container) {

        console.error(
            "[BANANOS] ERROR: promotionsContainer no existe"
        );

        return;
    }


    console.log(
        "[BANANOS] Consultando promociones..."
    );


    try {

        const response =
            await fetch(
                "/api/promotions",
                {
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        "Cache-Control":
                            "no-cache"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "[BANANOS] API:",
            data
        );


        const promotions =
            Array.isArray(data.promotions)
                ? data.promotions.filter(
                    promo =>
                        promo.active !== false
                )
                : [];


        console.log(
            "[BANANOS] ACTIVAS:",
            promotions.length
        );


        BANANOS_renderPromotionsFinal(
            promotions,
            container
        );

    }

    catch (error) {

        console.error(
            "[BANANOS] ERROR PROMOCIONES:",
            error
        );


        container.innerHTML = `

            <div class="bananos-promo-error">

                <span>⚠</span>

                <strong>
                    No pudimos cargar las promociones
                </strong>

                <small>
                    Intenta nuevamente
                </small>

            </div>

        `;

    }

}



/* ==========================================================
   RENDER FINAL
   ========================================================== */

function BANANOS_renderPromotionsFinal(
    promotions,
    container
) {

    /*
     * NO HAY PROMOCIONES
     */

    if (!promotions.length) {

        container.innerHTML = `

            <div class="bananos-empty-promos">

                <div class="bananos-empty-icon">
                    ✦
                </div>

                <span>
                    BANANOS BAR
                </span>

                <h3>
                    NUEVAS PROMOS
                    <b>MUY PRONTO</b>
                </h3>

                <p>
                    Mantente pendiente.
                </p>

            </div>

        `;

        return;
    }


    /*
     * MÁXIMO 3
     */

    container.innerHTML =
        promotions
            .slice(0, 3)
            .map(
                (promo, index) => {

                    const title =
                        BANANOS_escapePromo(
                            promo.title ||
                            "Promoción"
                        );


                    const description =
                        BANANOS_escapePromo(
                            promo.description ||
                            ""
                        );


                    const price =
                        BANANOS_escapePromo(
                            promo.price ||
                            ""
                        );


                    const image =
                        BANANOS_escapePromo(
                            promo.image ||
                            ""
                        );


                    return `

                    <article
                        class="bananos-promo-final"
                        style="
                            --promo-delay:
                            ${index * 120}ms
                        "
                    >


                        <div
                            class="bananos-promo-final-photo"
                        >

                            ${
                                image
                                ?
                                `
                                <img
                                    src="${image}?v=${Date.now()}"
                                    alt="${title}"
                                >
                                `
                                :
                                `
                                <div
                                    class="bananos-promo-no-image"
                                >
                                    🔥
                                </div>
                                `
                            }


                            <div
                                class="bananos-promo-final-gradient"
                            ></div>


                            <div
                                class="bananos-promo-final-top"
                            >

                                <span>
                                    OFERTA
                                </span>

                                <b>
                                    0${index + 1}
                                </b>

                            </div>


                            <div
                                class="bananos-promo-final-title"
                            >

                                <small>
                                    🔥 BANANOS BAR
                                </small>

                                <h2>
                                    ${title}
                                </h2>

                            </div>

                        </div>


                        <div
                            class="bananos-promo-final-info"
                        >

                            ${
                                description
                                ?
                                `
                                <p>
                                    ${description}
                                </p>
                                `
                                :
                                ""
                            }


                            ${
                                price
                                ?
                                `
                                <div
                                    class="bananos-promo-final-price"
                                >
                                    ${price}
                                </div>
                                `
                                :
                                ""
                            }


                            <div
                                class="bananos-promo-final-bottom"
                            >

                                <span>
                                    DISPONIBLE AHORA
                                </span>

                                <i>
                                    ✦
                                </i>

                            </div>

                        </div>


                    </article>

                    `;

                }
            )
            .join("");

}



/* ==========================================================
   SEGURIDAD TEXTO
   ========================================================== */

function BANANOS_escapePromo(
    value = ""
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}



/* ==========================================================
   INICIO
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            BANANOS_loadPromotionsFinal,
            500
        );

    }
);


/*
 * Refrescar al regresar al navegador
 */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            BANANOS_loadPromotionsFinal();

        }

    }
);


/*
 * Actualización automática
 * cada 10 segundos
 */

/* LEGACY PROMO INTERVAL BANANOS_loadPromotionsFinal DESACTIVADO */


console.log(
    "[BANANOS] PROMOTIONS FINAL V2 READY"
);



/* ==========================================================
   BANANOS BAR
   PROMOCIONES API - FIX DEFINITIVO
   Admin -> API -> Cliente
   ========================================================== */

(function () {

    "use strict";

    const API_URL = "/api/promotions";

    let promoTimer = null;


    /* ======================================================
       ESCAPAR TEXTO
       ====================================================== */

    function escapePromoText(value = "") {

        return String(value)

            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    /* ======================================================
       OBTENER CONTENEDOR REAL
       ====================================================== */

    function getPromoContainer() {

        return document.getElementById(
            "promotionsContainer"
        );
    }


    /* ======================================================
       SIN PROMOCIONES
       ====================================================== */

    function renderEmptyPromotions(container) {

        container.innerHTML = `

            <div class="bananos-api-empty">

                <div class="bananos-api-empty-icon">
                    🍻
                </div>

                <small>
                    BANANOS BAR
                </small>

                <h2>
                    PRÓXIMAMENTE
                    <span>NUEVAS PROMOS</span>
                </h2>

                <p>
                    Estamos preparando algo bueno para ti.
                </p>

            </div>
        `;
    }


    /* ======================================================
       CREAR TARJETA
       ====================================================== */

    function createPromoCard(promo, index) {

        const article =
            document.createElement("article");

        article.className =
            "bananos-api-promo";


        const title =
            escapePromoText(
                promo.title || "Promoción"
            );

        const description =
            escapePromoText(
                promo.description || ""
            );

        const price =
            escapePromoText(
                promo.price || ""
            );

        const image =
            escapePromoText(
                promo.image || ""
            );


        article.innerHTML = `

            <div class="bananos-api-promo-number">
                0${index + 1}
            </div>

            <div class="bananos-api-promo-photo">

                ${
                    image
                    ?
                    `
                    <img
                        src="${image}?v=${Date.now()}"
                        alt="${title}"
                        loading="lazy"
                    >
                    `
                    :
                    `
                    <div class="bananos-api-photo-empty">
                        🍻
                    </div>
                    `
                }

            </div>


            <div class="bananos-api-promo-content">

                <small>
                    ✦ PROMOCIÓN BANANOS
                </small>

                <h2>
                    ${title}
                </h2>

                ${
                    description
                    ?
                    `
                    <p>
                        ${description}
                    </p>
                    `
                    :
                    ""
                }

                ${
                    price
                    ?
                    `
                    <div class="bananos-api-price">
                        ${price}
                    </div>
                    `
                    :
                    ""
                }

            </div>
        `;


        article.animate(

            [
                {
                    opacity: 0,
                    transform:
                        "translateY(30px) scale(.97)"
                },

                {
                    opacity: 1,
                    transform:
                        "translateY(0) scale(1)"
                }
            ],

            {
                duration: 550,

                delay:
                    index * 100,

                fill: "both",

                easing:
                    "cubic-bezier(.2,.8,.2,1)"
            }
        );


        return article;
    }


    /* ======================================================
       RENDER
       ====================================================== */

    function renderApiPromotions(promotions) {

        const container =
            getPromoContainer();


        if (!container) {

            console.error(
                "[BANANOS] ERROR: promotionsContainer no existe."
            );

            return;
        }


        const activePromotions =
            promotions

                .filter(
                    promo =>
                        promo &&
                        promo.active !== false
                )

                .slice(
                    0,
                    3
                );


        container.innerHTML = "";


        if (
            activePromotions.length === 0
        ) {

            renderEmptyPromotions(
                container
            );

            return;
        }


        activePromotions.forEach(
            (promo, index) => {

                container.appendChild(
                    createPromoCard(
                        promo,
                        index
                    )
                );

            }
        );


        console.log(
            "[BANANOS] Promociones renderizadas:",
            activePromotions.length
        );
    }


    /* ======================================================
       CARGAR API
       ====================================================== */

    async function loadApiPromotions() {

        try {

            const response =
                await fetch(

                    API_URL +
                    "?t=" +
                    Date.now(),

                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );
            }


            const data =
                await response.json();


            console.log(
                "[BANANOS] API:",
                data
            );


            const promotions =
                Array.isArray(
                    data.promotions
                )
                    ? data.promotions
                    : [];


            renderApiPromotions(
                promotions
            );

        }

        catch (error) {

            console.error(
                "[BANANOS] Error API promociones:",
                error
            );

        }
    }


    /* ======================================================
       INICIAR
       ====================================================== */

    function startPromotionSystem() {

        console.log(
            "[BANANOS] Iniciando promociones API..."
        );


        loadApiPromotions();


        /*
           Actualización automática.
           Mientras estamos desarrollando localmente
           revisamos cada 5 segundos.
        */

        if (promoTimer) {

            clearInterval(
                promoTimer
            );
        }


        promoTimer =
            setInterval(

                loadApiPromotions,

                60000
            );
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startPromotionSystem
        );

    }

    else {

        startPromotionSystem();

    }


    /*
       También permitimos actualizar manualmente
       desde consola.
    */

    window.BANANOS_reloadPromotions =
        loadApiPromotions;

})();



/* ==========================================================
   BANANOS BAR
   FIX NAVEGACIÓN OFERTAS
   ========================================================== */

function BANANOS_openOfficialOffers() {

    console.log("[BANANOS] Abriendo promociones oficiales");

    /*
     * Ocultar pantallas principales.
     */
    document
        .querySelectorAll(".screen")
        .forEach(screen => {
            screen.classList.remove("active-screen");
            screen.classList.remove("active");
        });


    /*
     * Ocultar pantalla antigua específicamente.
     */
    const legacy =
        document.getElementById(
            "offersScreenLegacy"
        );

    if (legacy) {
        legacy.style.display = "none";
    }


    /*
     * Mostrar pantalla oficial.
     */
    const offers =
        document.getElementById(
            "offersScreen"
        );

    if (!offers) {

        console.error(
            "[BANANOS] offersScreen oficial no encontrado"
        );

        return;
    }


    offers.style.display = "block";

    offers.classList.add(
        "active-screen"
    );

    offers.classList.add(
        "active"
    );


    /*
     * Volver arriba.
     */
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /*
     * Recargar promociones.
     */
    if (
        typeof window.BANANOS_reloadPromotions ===
        "function"
    ) {

        window.BANANOS_reloadPromotions();
    }
}


/*
 * Interceptar botón inferior de ofertas.
 */
document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                '[data-page="ofertas"],' +
                '[data-page="offers"],' +
                '[data-page="promociones"]'
            );

        if (!button) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        BANANOS_openOfficialOffers();

    },
    true
);



/* ============================================================
   BANANOS BAR - FIX DEFINITIVO PROMOCIONES
   API -> #promotionsContainer
   ============================================================ */

async function BANANOS_PROMOS_FINAL() {

    const container =
        document.getElementById("promotionsContainer");

    if (!container) {
        console.error(
            "[BANANOS FINAL] No existe #promotionsContainer"
        );
        return;
    }

    try {

        const response = await fetch(
            "/api/promotions?t=" + Date.now(),
            {
                method: "GET",
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                "HTTP " + response.status
            );
        }

        const data =
            await response.json();

        const promotions =
            Array.isArray(data.promotions)
                ? data.promotions.filter(
                    p => p && p.active !== false
                ).slice(0, 3)
                : [];

        console.log(
            "[BANANOS FINAL] PROMOS:",
            promotions
        );

        container.innerHTML = "";

        if (promotions.length === 0) {

            container.innerHTML = `
                <div class="bf-no-promos">
                    <div class="bf-empty-icon">🍻</div>

                    <small>BANANOS BAR</small>

                    <h2>
                        PRÓXIMAMENTE
                    </h2>

                    <p>
                        Estamos preparando algo bueno.
                    </p>
                </div>
            `;

            return;
        }


        promotions.forEach(
            (promo, index) => {

                const card =
                    document.createElement("article");

                card.className =
                    "bf-promo-card";

                const title =
                    String(
                        promo.title ||
                        "Promoción"
                    );

                const description =
                    String(
                        promo.description ||
                        ""
                    );

                const price =
                    String(
                        promo.price ||
                        ""
                    );

                const image =
                    String(
                        promo.image ||
                        ""
                    );


                card.innerHTML = `

                    ${
                        image
                        ?
                        `
                        <div class="bf-promo-image">

                            <img
                                src="${image}?v=${Date.now()}"
                                alt="${title}"
                            >

                            <div
                                class="bf-image-gradient"
                            ></div>

                            <div
                                class="bf-number"
                            >
                                0${index + 1}
                            </div>

                        </div>
                        `
                        :
                        `
                        <div
                            class="
                                bf-promo-image
                                bf-promo-no-image
                            "
                        >
                            🍻

                            <div
                                class="bf-number"
                            >
                                0${index + 1}
                            </div>
                        </div>
                        `
                    }


                    <div class="bf-promo-info">

                        <small>
                            ✦ PROMOCIÓN BANANOS
                        </small>

                        <h2>
                            ${escapePromoHTML(title)}
                        </h2>

                        ${
                            description
                            ?
                            `
                            <p>
                                ${escapePromoHTML(description)}
                            </p>
                            `
                            :
                            ""
                        }

                        ${
                            price
                            ?
                            `
                            <strong
                                class="bf-promo-price"
                            >
                                ${escapePromoHTML(price)}
                            </strong>
                            `
                            :
                            ""
                        }

                    </div>

                `;


                container.appendChild(
                    card
                );


                card.animate(

                    [
                        {
                            opacity: 0,
                            transform:
                                "translateY(25px)"
                        },

                        {
                            opacity: 1,
                            transform:
                                "translateY(0)"
                        }
                    ],

                    {
                        duration: 500,
                        delay:
                            index * 100,
                        fill: "both",
                        easing:
                            "cubic-bezier(.2,.8,.2,1)"
                    }

                );

            }
        );

    }

    catch (error) {

        console.error(
            "[BANANOS FINAL] ERROR:",
            error
        );

        container.innerHTML = `

            <div class="bf-no-promos">

                <div class="bf-empty-icon">
                    ⚠️
                </div>

                <h2>
                    ERROR AL CARGAR
                </h2>

                <p>
                    Intenta nuevamente.
                </p>

            </div>

        `;

    }

}


function escapePromoHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}


/* CARGAR AL INICIAR */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            BANANOS_PROMOS_FINAL,
            300
        );

    }
);


/* ACTUALIZACIÓN AUTOMÁTICA */

/* PROMOS FINAL LEGACY INTERVAL DESACTIVADO */


/* EXPONER FUNCIÓN */

window.BANANOS_reloadPromotions =
    BANANOS_PROMOS_FINAL;




/* ============================================================
   OVERRIDE DEL SISTEMA LEGACY
   ============================================================ */

bananosFindPromoContainer =
function() {

    return document.getElementById(
        "promotionsContainer"
    );

};


bananosRenderLivePromotions =
function(promotions) {

    console.log(
        "[BANANOS] Renderer legacy redirigido:",
        promotions
    );

    renderPromotions(
        Array.isArray(promotions)
            ? promotions
            : []
    );

};



/* ==========================================================
   BANANOS BAR - SISTEMA PAGOS
========================================================== */

const BANANOS_PAYMENT_API = "/api/payments";

let BANANOS_PAYMENT_DATA = null;


function BANANOS_maskCard(number){

    const clean =
        String(number || "")
        .replace(/\D/g,"");

    if(!clean){
        return "";
    }

    return clean.replace(
        /(\d{4})(?=\d)/g,
        "$1 "
    );
}


function BANANOS_renderPayments(data){

    BANANOS_PAYMENT_DATA = data;

    const transfer =
        document.getElementById(
            "transferPayment"
        );

    const cash =
        document.getElementById(
            "cashPayment"
        );

    const bank =
        document.getElementById(
            "paymentBank"
        );

    const card =
        document.getElementById(
            "paymentCardMasked"
        );

    const holder =
        document.getElementById(
            "paymentHolder"
        );

    const holderBox =
        document.getElementById(
            "paymentHolderBox"
        );


    if(transfer){

        transfer.style.display =
            data.transfer_enabled === false
            ? "none"
            : "";

    }


    if(cash){

        cash.style.display =
            data.cash_enabled === false
            ? "none"
            : "";

    }


    if(bank){

        bank.textContent =
            data.bank || "BBVA";

    }


    if(card){

        const number = String(
            data.card_number || ""
        ).replace(/\D/g, "");

        card.textContent =
            number.replace(
                /(\d{4})(?=\d)/g,
                "$1 "
            );

    }


    if(holder && holderBox){

        const value =
            String(
                data.holder || ""
            ).trim();

        holder.textContent =
            value;

        holderBox.hidden =
            !value;

    }

}


async function BANANOS_loadPayments(){

    try{

        let response = await fetch(
            BANANOS_PAYMENT_API +
            "?t=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        /*
         * DESARROLLO LOCAL:
         * python http.server no tiene /api/payments.
         *
         * Si la API no existe, usamos el JSON local.
         * En la ESP32 la API responde 200 y este
         * fallback NO se utiliza.
         */
        if(!response.ok){

            console.warn(
                "[BANANOS] API payments no disponible. Usando JSON local."
            );

            response = await fetch(
                "/data/payments.json?t=" + Date.now(),
                {
                    cache: "no-store"
                }
            );

        }

        if(!response.ok){
            throw new Error(
                "Payments HTTP " + response.status
            );
        }

        const data =
            await response.json();

        BANANOS_PAYMENT_DATA =
            data;

        BANANOS_renderPayment(
            data
        );

        console.log(
            "[BANANOS] Payments cargados:",
            data
        );

    }
    catch(error){

        console.error(
            "[BANANOS] Error cargando payments:",
            error
        );

    }

}


async function BANANOS_copyPayment(){

    if(
        !BANANOS_PAYMENT_DATA ||
        !BANANOS_PAYMENT_DATA.card_number
    ){
        return;
    }


    const number =
        String(
            BANANOS_PAYMENT_DATA.card_number
        )
        .replace(/\D/g,"");


    try{

        await navigator.clipboard.writeText(
            number
        );

    }
    catch(error){

        const textarea =
            document.createElement(
                "textarea"
            );

        textarea.value =
            number;

        document.body.appendChild(
            textarea
        );

        textarea.select();

        document.execCommand(
            "copy"
        );

        textarea.remove();

    }


    const message =
        document.getElementById(
            "paymentMessage"
        );


    if(message){

        message.classList.add(
            "show"
        );

        setTimeout(
            () => {

                message.classList.remove(
                    "show"
                );

            },
            1800
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        BANANOS_loadPayments();


        document
        .getElementById(
            "copyPaymentButton"
        )
        ?.addEventListener(
            "click",
            BANANOS_copyPayment
        );

    }
);


setInterval(
    BANANOS_loadPayments,
    120000
);



/* ==========================================================
   BANANOS BAR
   FIX FINAL BOTON COPIAR TARJETA
   ========================================================== */

window.BANANOS_COPY_CARD_FINAL = async function () {

    const button =
        document.getElementById("copyPaymentButton");

    const cardElement =
        document.getElementById("paymentCardMasked");

    let number = "";

    if (
        typeof BANANOS_PAYMENT_DATA !== "undefined" &&
        BANANOS_PAYMENT_DATA &&
        BANANOS_PAYMENT_DATA.card_number
    ) {

        number =
            String(
                BANANOS_PAYMENT_DATA.card_number
            ).replace(/\D/g, "");

    }

    if (!number && cardElement) {

        number =
            String(
                cardElement.textContent || ""
            ).replace(/\D/g, "");

    }

    if (!number) {

        console.error(
            "[BANANOS] No existe número para copiar"
        );

        return;

    }


    let copied = false;


    /*
       Intento moderno.
       En HTTP por IP algunos navegadores
       pueden bloquear navigator.clipboard.
    */

    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                number
            );

            copied = true;

        }

    }
    catch (error) {

        console.warn(
            "[BANANOS] Clipboard API no disponible",
            error
        );

    }


    /*
       Fallback compatible con HTTP local
    */

    if (!copied) {

        try {

            const input =
                document.createElement("textarea");

            input.value = number;

            input.setAttribute(
                "readonly",
                ""
            );

            input.style.position =
                "fixed";

            input.style.opacity =
                "0";

            input.style.pointerEvents =
                "none";

            document.body.appendChild(
                input
            );

            input.focus();

            input.select();

            input.setSelectionRange(
                0,
                input.value.length
            );

            copied =
                document.execCommand(
                    "copy"
                );

            input.remove();

        }
        catch (error) {

            console.error(
                "[BANANOS] Error copiando:",
                error
            );

        }

    }


    if (button) {

        const original =
            button.textContent;

        button.textContent =
            copied
            ? "✓ COPIADO"
            : "SELECCIONAR";

        button.classList.toggle(
            "copied",
            copied
        );


        if (!copied && cardElement) {

            try {

                const selection =
                    window.getSelection();

                const range =
                    document.createRange();

                range.selectNodeContents(
                    cardElement
                );

                selection.removeAllRanges();

                selection.addRange(
                    range
                );

            }
            catch (error) {}

        }


        setTimeout(
            () => {

                button.textContent =
                    original || "COPIAR";

                button.classList.remove(
                    "copied"
                );

            },
            1600
        );

    }


    const message =
        document.getElementById(
            "paymentMessage"
        );


    if (message && copied) {

        message.textContent =
            "Número copiado";

        message.classList.add(
            "show"
        );

        setTimeout(
            () => {

                message.classList.remove(
                    "show"
                );

            },
            1600
        );

    }


    console.log(
        "[BANANOS] Tarjeta:",
        number,
        "Copiada:",
        copied
    );

};


/*
   Reemplazar listener viejo sin depender
   del momento en que cargó el DOM.
*/

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "#copyPaymentButton"
            );

        if (!button) {
            return;
        }

        event.preventDefault();

        event.stopImmediatePropagation();

        window.BANANOS_COPY_CARD_FINAL();

    },
    true
);



/* BANANOS_PAYMENT_FINAL_START */

(function () {

    console.log("[BANANOS] Payment Final cargado");

    const PAYMENT_LOCAL = "/data/payments.json";

    function cleanNumber(value) {
        return String(value || "").replace(/\D/g, "");
    }

    function formatNumber(value) {

        const number = cleanNumber(value);

        return number.replace(
            /(\d{4})(?=\d)/g,
            "$1 "
        );
    }

    async function getPaymentData() {

        try {

            const response = await fetch(
                PAYMENT_LOCAL + "?t=" + Date.now(),
                {
                    cache: "no-store"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "HTTP " + response.status
                );
            }

            return await response.json();

        }
        catch (error) {

            console.error(
                "[BANANOS] Error cargando payments.json:",
                error
            );

            return null;
        }
    }

    async function renderPaymentFinal() {

        const data = await getPaymentData();

        if (!data) {
            return;
        }

        window.BANANOS_PAYMENT_DATA = data;

        const bank =
            document.getElementById(
                "paymentBank"
            );

        const card =
            document.getElementById(
                "paymentCardMasked"
            );

        const transfer =
            document.getElementById(
                "paymentTransfer"
            );

        const cash =
            document.getElementById(
                "paymentCash"
            );

        if (bank) {

            bank.textContent =
                data.bank || "BBVA";
        }

        if (card) {

            const number =
                cleanNumber(
                    data.card_number
                );

            card.textContent =
                formatNumber(number);

            card.dataset.number =
                number;

            console.log(
                "[BANANOS] Tarjeta mostrada:",
                formatNumber(number)
            );
        }

        if (transfer) {

            transfer.hidden =
                data.transfer_enabled === false;
        }

        if (cash) {

            cash.hidden =
                data.cash_enabled === false;
        }
    }

    async function copyPaymentFinal() {

        const card =
            document.getElementById(
                "paymentCardMasked"
            );

        const button =
            document.getElementById(
                "copyPaymentButton"
            );

        if (!card) {
            return;
        }

        const number =
            cleanNumber(
                card.dataset.number ||
                card.textContent
            );

        if (!number) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                number
            );

        }
        catch (error) {

            const textarea =
                document.createElement(
                    "textarea"
                );

            textarea.value =
                number;

            textarea.style.position =
                "fixed";

            textarea.style.opacity =
                "0";

            document.body.appendChild(
                textarea
            );

            textarea.select();

            document.execCommand(
                "copy"
            );

            textarea.remove();
        }

        if (button) {

            const old =
                button.textContent;

            button.textContent =
                "✓ COPIADO";

            button.classList.add(
                "copied"
            );

            setTimeout(() => {

                button.textContent =
                    old === "✓ COPIADO"
                    ? "COPIAR"
                    : old;

                button.classList.remove(
                    "copied"
                );

            }, 1300);
        }

        console.log(
            "[BANANOS] Copiado:",
            number
        );
    }

    function initializePaymentFinal() {

        const button =
            document.getElementById(
                "copyPaymentButton"
            );

        if (button) {

            /*
             * Reemplazamos el botón por un clon.
             * Así eliminamos listeners viejos/duplicados.
             */

            const cleanButton =
                button.cloneNode(true);

            button.replaceWith(
                cleanButton
            );

            cleanButton.addEventListener(
                "click",
                copyPaymentFinal
            );
        }

        renderPaymentFinal();
    }

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializePaymentFinal,
            {
                once: true
            }
        );

    }
    else {

        initializePaymentFinal();
    }

    /*
     * Algunos módulos viejos pueden volver a pintar
     * la máscara durante el arranque.
     *
     * Hacemos una segunda sincronización únicamente
     * durante el boot.
     */

    setTimeout(
        renderPaymentFinal,
        300
    );

    setTimeout(
        renderPaymentFinal,
        1000
    );

})();

/* BANANOS_PAYMENT_FINAL_END */
