(() => {

    const MUSIC_API =
        "/api/music/requests";

    function escapeHTML(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    window.sendMusicRequest =
        async function () {

            const songInput =
                document.getElementById(
                    "musicSong"
                );

            const artistInput =
                document.getElementById(
                    "musicArtist"
                );

            const button =
                document.getElementById(
                    "musicSendButton"
                );

            const message =
                document.getElementById(
                    "musicMessage"
                );


            const song =
                songInput.value.trim();

            const artist =
                artistInput.value.trim();


            if (!song || !artist) {

                message.textContent =
                    "Escribe la canción y el artista.";

                message.className =
                    "music-message error";

                return;
            }


            button.disabled = true;
            button.textContent =
                "ENVIANDO...";


            try {

                const response =
                    await fetch(
                        MUSIC_API,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    song,
                                    artist
                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "No se pudo enviar."
                    );
                }


                songInput.value = "";
                artistInput.value = "";

                message.textContent =
                    "✓ PETICIÓN ENVIADA";

                message.className =
                    "music-message success";


                setTimeout(
                    () => {
                        message.textContent = "";
                    },
                    4000
                );


            } catch (error) {

                console.error(
                    "[BANANOS MUSIC]",
                    error
                );

                message.textContent =
                    error.message;

                message.className =
                    "music-message error";

            } finally {

                button.disabled = false;

                button.textContent =
                    "PEDIR CANCIÓN";
            }
        };


    console.log(
        "[BANANOS] Music Client OK"
    );

})();
