"use strict";

let bananosMenu = {
    categories: [],
    products: []
};

let editingProductId = null;


const menuProductList =
    document.getElementById(
        "menuProductList"
    );

const menuProductCount =
    document.getElementById(
        "menuProductCount"
    );

const menuCategory =
    document.getElementById(
        "menuCategory"
    );

const menuName =
    document.getElementById(
        "menuName"
    );

const menuTag =
    document.getElementById(
        "menuTag"
    );

const menuDescription =
    document.getElementById(
        "menuDescription"
    );

const menuPrice =
    document.getElementById(
        "menuPrice"
    );

const menuImage =
    document.getElementById(
        "menuImage"
    );

const menuSave =
    document.getElementById(
        "menuSave"
    );

const menuCancel =
    document.getElementById(
        "menuCancel"
    );


function menuEscape(value = "") {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


async function loadMenuAdmin() {

    try {

        const response =
            await fetch(
                "/api/menu?t=" +
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


        bananosMenu =
            await response.json();


        renderCategorySelect();

        renderMenuProducts();

    }

    catch (error) {

        console.error(
            "[MENU ADMIN]",
            error
        );


        if (menuProductList) {

            menuProductList.innerHTML = `
                <div class="menu-admin-empty">
                    ⚠️ No se pudo cargar el menú
                </div>
            `;
        }
    }
}


function renderCategorySelect() {

    if (!menuCategory) {
        return;
    }


    const current =
        menuCategory.value;


    menuCategory.innerHTML =
        `<option value="">
            Selecciona categoría
        </option>`;


    bananosMenu.categories
        .filter(
            category =>
                category.active !== false
        )
        .forEach(
            category => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category.id;

                option.textContent =
                    `${category.emoji || "🍹"} ${category.name}`;

                menuCategory.appendChild(
                    option
                );
            }
        );


    if (current) {

        menuCategory.value =
            current;
    }
}


function renderMenuProducts() {

    if (!menuProductList) {
        return;
    }


    const products =
        Array.isArray(
            bananosMenu.products
        )
            ? bananosMenu.products
            : [];


    if (menuProductCount) {

        menuProductCount.textContent =
            products.length;
    }


    if (!products.length) {

        menuProductList.innerHTML = `
            <div class="menu-admin-empty">
                <div>🍹</div>
                <strong>Sin productos</strong>
                <p>Agrega el primer producto.</p>
            </div>
        `;

        return;
    }


    menuProductList.innerHTML =
        products.map(
            product => {

                const category =
                    bananosMenu.categories.find(
                        item =>
                            item.id ===
                            product.category
                    );


                const image =
                    product.image
                        ? `
                        <img
                            src="${menuEscape(product.image)}"
                            alt=""
                        >
                        `
                        :
                        `
                        <div class="menu-product-no-image">
                            🍹
                        </div>
                        `;


                return `
                    <article
                        class="menu-admin-product
                        ${product.active === false
                            ? "menu-product-disabled"
                            : ""}"
                    >

                        <div class="menu-product-image">
                            ${image}
                        </div>

                        <div class="menu-product-info">

                            <small>
                                ${
                                    menuEscape(
                                        category?.name ||
                                        product.category
                                    )
                                }
                            </small>

                            <h3>
                                ${
                                    menuEscape(
                                        product.name
                                    )
                                }
                            </h3>

                            <p>
                                ${
                                    menuEscape(
                                        product.description || ""
                                    )
                                }
                            </p>

                            ${
                                product.price
                                ?
                                `
                                <strong class="menu-product-price">
                                    ${
                                        menuEscape(
                                            product.price
                                        )
                                    }
                                </strong>
                                `
                                :
                                ""
                            }

                        </div>


                        <div class="menu-product-actions">

                            <button
                                type="button"
                                onclick="editMenuProduct('${product.id}')"
                            >
                                ✎ EDITAR
                            </button>

                            <button
                                type="button"
                                onclick="toggleMenuProduct('${product.id}')"
                            >
                                ${
                                    product.active === false
                                    ? "👁 MOSTRAR"
                                    : "◉ OCULTAR"
                                }
                            </button>

                            <button
                                type="button"
                                class="danger"
                                onclick="removeMenuProduct('${product.id}')"
                            >
                                🗑 ELIMINAR
                            </button>

                        </div>

                    </article>
                `;
            }
        ).join("");
}


function resetMenuEditor() {

    editingProductId = null;

    if (menuName) {
        menuName.value = "";
    }

    if (menuTag) {
        menuTag.value = "";
    }

    if (menuDescription) {
        menuDescription.value = "";
    }

    if (menuPrice) {
        menuPrice.value = "";
    }

    if (menuCategory) {
        menuCategory.value = "";
    }

    if (menuImage) {
        menuImage.value = "";
    }


    if (menuSave) {

        menuSave.textContent =
            "＋ AGREGAR PRODUCTO";
    }


    if (menuCancel) {

        menuCancel.hidden = true;
    }
}


window.editMenuProduct =
function(id) {

    const product =
        bananosMenu.products.find(
            item =>
                item.id === id
        );


    if (!product) {
        return;
    }


    editingProductId =
        product.id;


    menuName.value =
        product.name || "";

    menuTag.value =
        product.tag || "";

    menuDescription.value =
        product.description || "";

    menuPrice.value =
        product.price || "";

    menuCategory.value =
        product.category || "";


    menuSave.textContent =
        "✓ GUARDAR CAMBIOS";

    menuCancel.hidden =
        false;


    document.getElementById(
        "menuEditor"
    )?.scrollIntoView({
        behavior: "smooth"
    });
};


window.toggleMenuProduct =
async function(id) {

    const product =
        bananosMenu.products.find(
            item =>
                item.id === id
        );


    if (!product) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/menu/products/" +
                encodeURIComponent(id),
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            active:
                                product.active === false
                        })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "No se pudo actualizar"
            );
        }


        await loadMenuAdmin();

    }

    catch (error) {

        alert(
            error.message
        );
    }
};


window.removeMenuProduct =
async function(id) {

    const product =
        bananosMenu.products.find(
            item =>
                item.id === id
        );


    if (!product) {
        return;
    }


    if (
        !confirm(
            `¿Eliminar "${product.name}" del menú?`
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                "/api/menu/products/" +
                encodeURIComponent(id),
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "No se pudo eliminar"
            );
        }


        resetMenuEditor();

        await loadMenuAdmin();

    }

    catch (error) {

        alert(
            error.message
        );
    }
};


async function saveMenuProduct() {

    const name =
        menuName.value.trim();

    const category =
        menuCategory.value;

    const tag =
        menuTag.value.trim();

    const description =
        menuDescription.value.trim();

    const price =
        menuPrice.value.trim();


    if (!name) {

        alert(
            "Escribe el nombre del producto."
        );

        menuName.focus();

        return;
    }


    if (!category) {

        alert(
            "Selecciona una categoría."
        );

        return;
    }


    menuSave.disabled =
        true;


    try {

        let response;


        if (editingProductId) {

            response =
                await fetch(
                    "/api/menu/products/" +
                    encodeURIComponent(
                        editingProductId
                    ),
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                name,
                                category,
                                tag,
                                description,
                                price
                            })
                    }
                );

        }

        else {

            const form =
                new FormData();


            form.append(
                "name",
                name
            );

            form.append(
                "category",
                category
            );

            form.append(
                "tag",
                tag
            );

            form.append(
                "description",
                description
            );

            form.append(
                "price",
                price
            );


            if (
                menuImage.files &&
                menuImage.files[0]
            ) {

                form.append(
                    "image",
                    menuImage.files[0]
                );
            }


            response =
                await fetch(
                    "/api/menu/products",
                    {
                        method: "POST",
                        body: form
                    }
                );
        }


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "No se pudo guardar"
            );
        }


        resetMenuEditor();

        await loadMenuAdmin();


        if (
            typeof showToast ===
            "function"
        ) {

            showToast(
                editingProductId
                    ? "Producto actualizado"
                    : "Producto agregado"
            );
        }

    }

    catch (error) {

        console.error(
            "[MENU SAVE]",
            error
        );

        alert(
            error.message
        );

    }

    finally {

        menuSave.disabled =
            false;
    }
}


if (menuSave) {

    menuSave.addEventListener(
        "click",
        saveMenuProduct
    );
}


if (menuCancel) {

    menuCancel.addEventListener(
        "click",
        resetMenuEditor
    );
}


document.addEventListener(
    "DOMContentLoaded",
    loadMenuAdmin
);
