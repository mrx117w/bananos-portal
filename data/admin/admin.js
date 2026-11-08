"use strict";

/* ==========================================================
   BANANOS BAR
   ADMIN SYSTEM V2
   Compatible con server.py y futuro ESP32
   ========================================================== */

const MAX_PROMOTIONS = 3;
const MAX_IMAGE_SIZE = 900 * 1024;

let promotions = [];


/* ==========================================================
   ELEMENTOS
   ========================================================== */

const imageInput =
    document.getElementById("promoImage");

const imagePreview =
    document.getElementById("imagePreview");

const titleInput =
    document.getElementById("promoTitle");

const descriptionInput =
    document.getElementById("promoDescription");

const saveButton =
    document.getElementById("savePromotion");

const promotionsList =
    document.getElementById("promotionsList");

const promoCounter =
    document.getElementById("promoCounter");

const toast =
    document.getElementById("toast");


/* ==========================================================
   DEBUG
   ========================================================== */

console.log("================================");
console.log("BANANOS ADMIN SYSTEM V2");
console.log("================================");

console.log("Imagen:", imageInput);
console.log("Título:", titleInput);
console.log("Descripción:", descriptionInput);
console.log("Botón:", saveButton);


/* ==========================================================
   TOAST
   ========================================================== */

let toastTimer = null;

function showToast(text) {

    if (!toast) {
        return;
    }

    clearTimeout(toastTimer);

    toast.textContent = text;

    toast.classList.add("show");

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2600);
}


/* ==========================================================
   ESCAPAR HTML
   ========================================================== */

function escapeHTML(value = "") {

    return String(value)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ==========================================================
   PREVIEW DE IMAGEN
   ========================================================== */

if (imageInput) {

    imageInput.addEventListener(
        "change",
        () => {

            const file =
                imageInput.files[0];

            if (!file) {
                return;
            }


            if (file.size > MAX_IMAGE_SIZE) {

                alert(
                    "La imagen pesa demasiado.\n\n" +
                    "Máximo permitido: 900 KB."
                );

                imageInput.value = "";

                return;
            }


            if (
                ![
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ].includes(file.type)
            ) {

                alert(
                    "Formato no compatible.\n\n" +
                    "Usa JPG, PNG o WEBP."
                );

                imageInput.value = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload = event => {

                imagePreview.innerHTML = `
                    <img
                        src="${event.target.result}"
                        alt="Vista previa"
                    >
                `;

            };


            reader.readAsDataURL(file);

        }
    );

}


/* ==========================================================
   OBTENER PROMOCIONES
   ========================================================== */

async function loadPromotions() {

    console.log(
        "[ADMIN] Solicitando promociones..."
    );


    try {

        const response =
            await fetch(
                "/api/promotions",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        console.log(
            "[ADMIN] GET:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }


        const data =
            await response.json();


        promotions =
            Array.isArray(data.promotions)
                ? data.promotions
                : [];


        console.log(
            "[ADMIN] Promociones:",
            promotions
        );


        renderPromotions();

    }

    catch (error) {

        console.error(
            "[ADMIN] ERROR GET:",
            error
        );


        promotionsList.innerHTML = `
            <div class="empty-state">
                <div>⚠️</div>

                <strong>
                    Error de conexión
                </strong>

                <p>
                    No se pudo consultar
                    /api/promotions
                </p>
            </div>
        `;

    }

}


/* ==========================================================
   RENDER
   ========================================================== */

function renderPromotions() {

    const count =
        promotions.length;


    if (promoCounter) {

        promoCounter.textContent =
            count;

    }


    if (saveButton) {

        if (count >= MAX_PROMOTIONS) {

            saveButton.disabled = true;

            saveButton.innerHTML = `
                <span>✓</span>
                LÍMITE DE 3 PROMOCIONES
            `;

        }

        else {

            saveButton.disabled = false;

            saveButton.innerHTML = `
                <span>＋</span>
                PUBLICAR PROMOCIÓN
            `;

        }

    }


    if (count === 0) {

        promotionsList.innerHTML = `
            <div class="empty-state">

                <div>🍹</div>

                <strong>
                    Sin promociones
                </strong>

                <p>
                    Agrega tu primera promoción.
                </p>

            </div>
        `;

        return;
    }


    promotionsList.innerHTML = "";


    promotions.forEach(
        (promotion, index) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "admin-promo-card";


            const image =
                escapeHTML(
                    promotion.image
                );

            const title =
                escapeHTML(
                    promotion.title
                );

            const description =
                escapeHTML(
                    promotion.description
                );

            const price =
                escapeHTML(
                    promotion.price || ""
                );


            card.innerHTML = `

                <div style="position:relative">

                    <img
                        src="${image}?t=${Date.now()}"
                        alt="${title}"
                    >

                    <span style="
                        position:absolute;
                        top:12px;
                        left:12px;
                        padding:7px 11px;
                        border-radius:30px;
                        background:rgba(0,0,0,.78);
                        color:#ffd400;
                        font-size:9px;
                        font-weight:900;
                        letter-spacing:1px;
                    ">
                        PROMO ${index + 1}
                    </span>

                </div>


                <div class="admin-promo-info">

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
                        <strong style="
                            display:block;
                            margin-top:12px;
                            color:#36ff3c;
                            font-size:17px;
                        ">
                            ${price}
                        </strong>
                        `
                        :
                        ""
                    }


                    <button
                        type="button"
                        class="delete-promo"
                        data-id="${escapeHTML(
                            promotion.id
                        )}"
                    >
                        ELIMINAR PROMOCIÓN
                    </button>

                </div>
            `;


            promotionsList.appendChild(
                card
            );

        }
    );


    document
        .querySelectorAll(
            ".delete-promo"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deletePromotion(
                        button.dataset.id
                    );

                }
            );

        });

}


/* ==========================================================
   PUBLICAR
   ========================================================== */

async function publishPromotion() {

    console.log(
        "[ADMIN] Botón PUBLICAR presionado"
    );


    if (
        promotions.length >=
        MAX_PROMOTIONS
    ) {

        alert(
            "Ya tienes 3 promociones."
        );

        return;
    }


    const file =
        imageInput?.files[0];


    const title =
        titleInput?.value.trim();


    const description =
        descriptionInput?.value.trim();


    if (!file) {

        alert(
            "Selecciona una foto."
        );

        return;
    }


    if (!title) {

        alert(
            "Escribe el nombre de la promoción."
        );

        titleInput?.focus();

        return;
    }


    if (!description) {

        alert(
            "Escribe la descripción."
        );

        descriptionInput?.focus();

        return;
    }


    if (file.size > MAX_IMAGE_SIZE) {

        alert(
            "La imagen supera 900 KB."
        );

        return;
    }


    const formData =
        new FormData();


    formData.append(
        "image",
        file
    );

    formData.append(
        "title",
        title
    );

    formData.append(
        "description",
        description
    );

    /*
       El HTML actual todavía no tiene
       campo precio, pero server.py
       lo acepta opcionalmente.
    */

    formData.append(
        "price",
        ""
    );


    saveButton.disabled = true;

    saveButton.innerHTML = `
        <span>●</span>
        PUBLICANDO...
    `;


    console.log(
        "[ADMIN] Enviando POST..."
    );


    try {

        const response =
            await fetch(
                "/api/promotions",
                {
                    method: "POST",
                    body: formData,
                    cache: "no-store"
                }
            );


        console.log(
            "[ADMIN] POST:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "[ADMIN] Respuesta:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.error ||
                "No se pudo publicar."
            );

        }


        showToast(
            "✓ PROMOCIÓN PUBLICADA"
        );


        imageInput.value = "";

        titleInput.value = "";

        descriptionInput.value = "";


        imagePreview.innerHTML = `

            <span class="camera">
                📷
            </span>

            <strong>
                SUBIR FOTO
            </strong>

            <small>
                Toca para seleccionar
            </small>
        `;


        await loadPromotions();


        setTimeout(
            () => {

                document
                    .querySelector(
                        ".current-section"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            },
            250
        );

    }

    catch (error) {

        console.error(
            "[ADMIN] ERROR POST:",
            error
        );


        alert(
            "No se pudo publicar:\n\n" +
            error.message
        );

    }

    finally {

        renderPromotions();

    }

}


/* ==========================================================
   ELIMINAR
   ========================================================== */

async function deletePromotion(id) {

    if (!id) {
        return;
    }


    const confirmed =
        confirm(
            "¿Eliminar esta promoción?"
        );


    if (!confirmed) {
        return;
    }


    console.log(
        "[ADMIN] Eliminando:",
        id
    );


    try {

        const response =
            await fetch(
                "/api/promotions/" +
                encodeURIComponent(id),
                {
                    method: "DELETE",
                    cache: "no-store"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "No se pudo eliminar."
            );

        }


        showToast(
            "PROMOCIÓN ELIMINADA"
        );


        await loadPromotions();

    }

    catch (error) {

        console.error(
            "[ADMIN] DELETE:",
            error
        );


        alert(
            "Error al eliminar:\n\n" +
            error.message
        );

    }

}


/* ==========================================================
   BOTÓN PUBLICAR
   ========================================================== */

if (saveButton) {

    saveButton.addEventListener(
        "click",
        publishPromotion
    );

}

else {

    console.error(
        "[ADMIN] No existe #savePromotion"
    );

}


/* ==========================================================
   INICIAR
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "[ADMIN] DOM listo"
        );

        loadPromotions();

    }
);
