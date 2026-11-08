"use strict";

/* ============================================================
   BANANOS BAR
   LIVE MENU ENGINE V1
   API: /api/menu
   ============================================================ */

const BANANOS_MENU_API = "/api/menu";

let BANANOS_LIVE_MENU = {
    categories: [],
    products: []
};


/* ============================================================
   CONFIGURACIÓN DE PANTALLAS
   ============================================================ */

const BANANOS_CATEGORY_SCREENS = {

    "cerveza": {
        screen: "beerScreen",
        emoji: "🍺"
    },

    "whisky": {
        screen: "whiskyScreen",
        emoji: "🥃"
    },

    "ron": {
        screen: "ronScreen",
        emoji: "🍹"
    },

    "tequila": {
        screen: "tequilaScreen",
        emoji: "🌵"
    },

    "sin-alcohol": {
        screen: "zeroScreen",
        emoji: "🧊"
    },

    "snacks": {
        screen: "snacksScreen",
        emoji: "🍿"
    }

};


/* ============================================================
   ESCAPAR HTML
   ============================================================ */

function bananosMenuEscape(value = "") {

    const div =
        document.createElement("div");

    div.textContent =
        String(value ?? "");

    return div.innerHTML;
}


/* ============================================================
   NORMALIZAR IMAGEN
   ============================================================ */

function bananosMenuImage(value = "") {

    value =
        String(value || "").trim();

    if (!value) {
        return "";
    }

    return value;
}


/* ============================================================
   CREAR TARJETA
   ============================================================ */

function bananosCreateProductCard(
    product,
    emoji
) {

    const article =
        document.createElement("article");

    article.className =
        "drink-card bananos-live-product";

    article.dataset.productId =
        product.id || "";

    const name =
        bananosMenuEscape(
            product.name || "PRODUCTO"
        );

    const tag =
        bananosMenuEscape(
            product.tag || ""
        );

    const description =
        bananosMenuEscape(
            product.description || ""
        );

    const price =
        bananosMenuEscape(
            product.price || ""
        );

    const image =
        bananosMenuImage(
            product.image
        );

    const safeEmoji =
        bananosMenuEscape(
            emoji || "🍹"
        );


    article.innerHTML = `

        <div class="drink-photo">

            ${
                image
                ?
                `
                <img
                    src="${bananosMenuEscape(image)}"
                    alt="${name}"
                    loading="lazy"
                    onerror="imageFallback(this,'${safeEmoji}')"
                >
                `
                :
                `
                <div class="image-fallback">
                    ${safeEmoji}
                </div>
                `
            }

        </div>


        <div class="drink-info">

            ${
                tag
                ?
                `
                <small>
                    ${tag}
                </small>
                `
                :
                ""
            }

            <h3>
                ${name}
            </h3>

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
                <div class="bananos-menu-price">
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


/* ============================================================
   ENCONTRAR ÁREA DONDE PONER PRODUCTOS
   ============================================================ */

function bananosPrepareProductContainer(
    screen,
    categoryId
) {

    /*
       Creamos UN contenedor administrado por API.

       No tocamos:
       - header
       - hero
       - navegación
       - promociones
       - otras secciones del sitio
    */

    let container =
        screen.querySelector(
            ".bananos-live-products"
        );


    if (container) {
        return container;
    }


    container =
        document.createElement("div");

    container.className =
        "bananos-live-products";

    container.dataset.category =
        categoryId;


    /*
       Ocultar SOLO las tarjetas antiguas.

       Las dejamos físicamente en HTML para
       poder regresar fácilmente al diseño
       anterior si fuera necesario.
    */

    const legacyProducts =
        screen.querySelectorAll(
            ".drink-card, .beer-item"
        );


    legacyProducts.forEach(
        element => {

            element.classList.add(
                "bananos-legacy-product"
            );

            element.style.display =
                "none";
        }
    );


    /*
       CERVEZA contiene elementos decorativos adicionales.

       Insertamos el menú dinámico antes del final
       de la pantalla.
    */

    screen.appendChild(
        container
    );


    return container;
}


/* ============================================================
   RENDERIZAR UNA CATEGORÍA
   ============================================================ */

function bananosRenderCategory(
    categoryId
) {

    const config =
        BANANOS_CATEGORY_SCREENS[
            categoryId
        ];


    if (!config) {
        return;
    }


    const screen =
        document.getElementById(
            config.screen
        );


    if (!screen) {

        console.warn(
            "[BANANOS MENU] Pantalla no encontrada:",
            config.screen
        );

        return;
    }


    const container =
        bananosPrepareProductContainer(
            screen,
            categoryId
        );


    const products =
        BANANOS_LIVE_MENU.products
            .filter(
                product =>
                    product &&
                    product.category ===
                        categoryId &&
                    product.active !== false
            );


    container.innerHTML = "";


    if (!products.length) {

        container.innerHTML = `

            <div class="bananos-menu-empty">

                <span>
                    ${config.emoji}
                </span>

                <small>
                    BANANOS BAR
                </small>

                <h3>
                    PRÓXIMAMENTE
                </h3>

                <p>
                    Estamos preparando
                    nuevas opciones.
                </p>

            </div>
        `;

        return;
    }


    products.forEach(
        product => {

            container.appendChild(
                bananosCreateProductCard(
                    product,
                    config.emoji
                )
            );

        }
    );

}


/* ============================================================
   ACTUALIZAR INFORMACIÓN DE CATEGORÍAS
   ============================================================ */

function bananosRenderCategoryInfo() {

    BANANOS_LIVE_MENU.categories
        .forEach(
            category => {

                if (
                    !category ||
                    category.active === false
                ) {
                    return;
                }


                const config =
                    BANANOS_CATEGORY_SCREENS[
                        category.id
                    ];


                if (!config) {
                    return;
                }


                const screen =
                    document.getElementById(
                        config.screen
                    );


                if (!screen) {
                    return;
                }


                const hero =
                    screen.querySelector(
                        ".category-hero"
                    );


                if (!hero) {
                    return;
                }


                const emoji =
                    hero.querySelector(
                        ":scope > span"
                    );

                const title =
                    hero.querySelector(
                        "h2"
                    );

                const description =
                    hero.querySelector(
                        "p"
                    );


                if (
                    emoji &&
                    category.emoji
                ) {
                    emoji.textContent =
                        category.emoji;
                }


                if (
                    title &&
                    category.name
                ) {
                    title.textContent =
                        category.name;
                }


                if (
                    description &&
                    category.description
                ) {
                    description.textContent =
                        category.description;
                }

            }
        );

}


/* ============================================================
   RENDER COMPLETO
   ============================================================ */

function bananosRenderLiveMenu() {

    bananosRenderCategoryInfo();


    Object.keys(
        BANANOS_CATEGORY_SCREENS
    ).forEach(
        categoryId => {

            bananosRenderCategory(
                categoryId
            );

        }
    );


    console.log(
        "[BANANOS MENU] Render completo:",
        BANANOS_LIVE_MENU.products.length,
        "productos"
    );

}


/* ============================================================
   CARGAR API
   ============================================================ */

async function bananosLoadLiveMenu() {

    try {

        const response =
            await fetch(
                BANANOS_MENU_API +
                "?t=" +
                Date.now(),
                {
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


        if (
            !data ||
            !Array.isArray(
                data.categories
            ) ||
            !Array.isArray(
                data.products
            )
        ) {

            throw new Error(
                "Formato de menú inválido"
            );
        }


        BANANOS_LIVE_MENU =
            data;


        bananosRenderLiveMenu();


        return true;

    }

    catch (error) {

        console.error(
            "[BANANOS MENU] Error:",
            error
        );


        /*
           IMPORTANTE:

           Si la API falla NO ocultamos el menú
           original.

           Así la página nunca queda vacía.
        */

        document
            .querySelectorAll(
                ".bananos-legacy-product"
            )
            .forEach(
                element => {

                    element.style.display =
                        "";

                }
            );


        return false;
    }

}


/* ============================================================
   REFRESCO
   ============================================================ */

let bananosMenuRefreshRunning =
    false;


async function bananosRefreshLiveMenu() {

    if (
        bananosMenuRefreshRunning
    ) {
        return;
    }


    bananosMenuRefreshRunning =
        true;


    try {

        await bananosLoadLiveMenu();

    }

    finally {

        bananosMenuRefreshRunning =
            false;

    }

}


/* ============================================================
   INICIO
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            bananosRefreshLiveMenu,
            250
        );

    }
);


/*
   Cuando el cliente regresa a la pestaña,
   vuelve a consultar el menú.
*/

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            bananosRefreshLiveMenu();

        }

    }
);


/*
   Refresco automático.

   De momento 5 segundos.
   Después podemos cambiar esto por SSE/WebSocket.
*/

setInterval(
    bananosRefreshLiveMenu,
    5000
);


console.log(
    "%cBANANOS LIVE MENU ONLINE",
    "color:#ffd000;font-weight:900;"
);
