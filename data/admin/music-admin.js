(() => {

    const MUSIC_API =
        "/api/music/requests";

    let lastSignature = "";


    function escapeHTML(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function formatTime(value) {

        if (!value) {
            return "";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        return date.toLocaleTimeString(
            "es-MX",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    function renderMusicRequests(requests) {

        const list =
            document.getElementById(
                "musicRequestsList"
            );

        const counter =
            document.getElementById(
                "musicPendingCounter"
            );


        if (!list) {
            return;
        }


        const pending =
            requests.filter(
                item =>
                    item.status === "pending"
            );


        if (counter) {

            counter.textContent =
                `${pending.length} PENDIENTES`;
        }


        if (!requests.length) {

            list.innerHTML = `
                <div class="music-admin-empty">

                    <div>♫</div>

                    <strong>
                        Sin peticiones
                    </strong>

                    <p>
                        Esperando canciones...
                    </p>

                </div>
            `;

            return;
        }


        list.innerHTML =
            requests.map(
                (item, index) => {

                    const played =
                        item.status === "played";

                    return `
                        <article
                            class="
                                music-request-item
                                ${played ? "played" : ""}
                            "
                        >

                            <div class="music-request-number">
                                ${String(
                                    requests.length - index
                                ).padStart(2, "0")}
                            </div>


                            <div class="music-request-data">

                                <small>
                                    ${played
                                        ? "✓ ATENDIDA"
                                        : "PETICIÓN"}
                                </small>

                                <strong>
                                    ${escapeHTML(item.song)}
                                </strong>

                                <p>
                                    ${escapeHTML(item.artist)}
                                </p>

                                <time>
                                    ${formatTime(
                                        item.created_at
                                    )}
                                </time>

                            </div>


                            <div class="music-request-actions">

                                ${
                                    !played
                                    ?
                                    `
                                    <button
                                        class="music-played-button"
                                        onclick="
                                            BANANOS_markMusicPlayed(
                                                '${item.id}'
                                            )
                                        "
                                    >
                                        ✓ ATENDIDA
                                    </button>
                                    `
                                    :
                                    ""
                                }


                                <button
                                    class="music-delete-button"
                                    onclick="
                                        BANANOS_deleteMusicRequest(
                                            '${item.id}'
                                        )
                                    "
                                >
                                    ELIMINAR
                                </button>

                            </div>

                        </article>
                    `;
                }
            ).join("");
    }


    async function loadMusicRequests() {

        try {

            const response =
                await fetch(
                    MUSIC_API +
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


            const requests =
                Array.isArray(
                    data.requests
                )
                    ? data.requests
                    : [];


            const signature =
                JSON.stringify(requests);


            if (
                signature !==
                lastSignature
            ) {

                lastSignature =
                    signature;

                renderMusicRequests(
                    requests
                );
            }


        } catch (error) {

            console.error(
                "[ADMIN MUSIC]",
                error
            );
        }
    }


    window.BANANOS_markMusicPlayed =
        async function (id) {

            try {

                const response =
                    await fetch(
                        MUSIC_API +
                        "/" +
                        encodeURIComponent(id),
                        {
                            method: "PATCH"
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "No se pudo actualizar."
                    );
                }


                lastSignature = "";

                await loadMusicRequests();


            } catch (error) {

                alert(
                    error.message
                );
            }
        };


    window.BANANOS_deleteMusicRequest =
        async function (id) {

            if (
                !confirm(
                    "¿Eliminar esta petición?"
                )
            ) {
                return;
            }


            try {

                const response =
                    await fetch(
                        MUSIC_API +
                        "/" +
                        encodeURIComponent(id),
                        {
                            method: "DELETE"
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "No se pudo eliminar."
                    );
                }


                lastSignature = "";

                await loadMusicRequests();


            } catch (error) {

                alert(
                    error.message
                );
            }
        };


    document.addEventListener(
        "DOMContentLoaded",
        () => {

            loadMusicRequests();

            setInterval(
                loadMusicRequests,
                3000
            );
        }
    );


    console.log(
        "[BANANOS] Music Admin OK"
    );

})();
