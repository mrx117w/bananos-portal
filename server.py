#!/usr/bin/env python3

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse
from pathlib import Path
from datetime import datetime
from email.parser import BytesParser
from email.policy import default
import json
import uuid


# ============================================================
# BANANOS BAR
# SERVIDOR LOCAL LIMPIO
#
# Frontend
# Pagos
# Promociones
# Música
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
WEB_DIR = BASE_DIR / "data"
JSON_DIR = WEB_DIR / "data"

PAYMENTS_FILE = JSON_DIR / "payments.json"
PROMOTIONS_FILE = JSON_DIR / "promotions.json"
MUSIC_FILE = JSON_DIR / "music.json"
MENU_FILE = JSON_DIR / "menu.json"

MENU_UPLOADS_DIR = (
    WEB_DIR /
    "assets" /
    "img" /
    "menu" /
    "uploads"
)

MAX_MENU_IMAGE = 2 * 1024 * 1024

MENU_UPLOADS_DIR.mkdir(
    parents=True,
    exist_ok=True
)

PROMOS_DIR = (
    WEB_DIR /
    "assets" /
    "img" /
    "promos"
)

HOST = "0.0.0.0"
PORT = 8080

MAX_PROMOTIONS = 3
MAX_PROMO_IMAGE = 900 * 1024
MAX_MUSIC_REQUESTS = 100


JSON_DIR.mkdir(
    parents=True,
    exist_ok=True
)

PROMOS_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# JSON
# ============================================================

def read_json(path, default):

    try:

        if not path.exists():

            write_json(
                path,
                default
            )

            return default

        data = json.loads(
            path.read_text(
                encoding="utf-8"
            )
        )

        return data

    except Exception as error:

        print(
            f"[JSON ERROR] "
            f"{path.name}: {error}"
        )

        return default


def write_json(path, data):

    path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    path.write_text(
        json.dumps(
            data,
            ensure_ascii=False,
            indent=2
        ),
        encoding="utf-8"
    )


# ============================================================
# HANDLER
# ============================================================

class BananosHandler(
    SimpleHTTPRequestHandler
):

    def __init__(
        self,
        *args,
        **kwargs
    ):

        super().__init__(
            *args,
            directory=str(WEB_DIR),
            **kwargs
        )


    # ========================================================
    # JSON RESPONSE
    # ========================================================

    def send_json(
        self,
        data,
        status=200
    ):

        raw = json.dumps(
            data,
            ensure_ascii=False
        ).encode("utf-8")

        self.send_response(
            status
        )

        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8"
        )

        self.send_header(
            "Content-Length",
            str(len(raw))
        )

        self.send_header(
            "Cache-Control",
            "no-store"
        )

        self.end_headers()

        self.wfile.write(
            raw
        )


    # ========================================================
    # JSON BODY
    # ========================================================

    def read_json_body(self):

        length = int(
            self.headers.get(
                "Content-Length",
                "0"
            )
        )

        raw = self.rfile.read(
            length
        )

        return json.loads(
            raw.decode("utf-8")
        )


    # ========================================================
    # MULTIPART
    # ========================================================

    def read_multipart(self):

        content_type = self.headers.get(
            "Content-Type",
            ""
        )

        if (
            "multipart/form-data"
            not in content_type
        ):

            raise ValueError(
                "Formulario inválido"
            )

        length = int(
            self.headers.get(
                "Content-Length",
                "0"
            )
        )

        if length <= 0:

            raise ValueError(
                "Formulario vacío"
            )

        # Permitimos margen sobre los 900 KB
        # debido al multipart.
        if length > (
            MAX_PROMO_IMAGE
            + 1024 * 1024
        ):

            raise ValueError(
                "Archivo demasiado grande"
            )

        body = self.rfile.read(
            length
        )

        fake_message = (
            b"Content-Type: "
            + content_type.encode()
            + b"\r\n"
            + b"MIME-Version: 1.0\r\n\r\n"
            + body
        )

        message = BytesParser(
            policy=default
        ).parsebytes(
            fake_message
        )

        fields = {}
        files = {}

        if not message.is_multipart():

            raise ValueError(
                "Multipart inválido"
            )

        for part in message.iter_parts():

            name = part.get_param(
                "name",
                header="content-disposition"
            )

            filename = part.get_filename()

            payload = (
                part.get_payload(
                    decode=True
                )
                or b""
            )

            if not name:
                continue

            if filename:

                files[name] = {
                    "filename":
                        filename,
                    "data":
                        payload
                }

            else:

                charset = (
                    part.get_content_charset()
                    or "utf-8"
                )

                fields[name] = (
                    payload.decode(
                        charset,
                        errors="replace"
                    )
                )

        return fields, files


    # ========================================================
    # GET
    # ========================================================

    def read_body_json(self):

        length_raw = self.headers.get(
            "Content-Length",
            "0"
        )

        try:
            length = int(length_raw)
        except (TypeError, ValueError):
            raise ValueError("Content-Length inválido")

        if length <= 0:
            raise ValueError("Body vacío")

        raw = self.rfile.read(length)

        if not raw:
            raise ValueError("Body vacío")

        return json.loads(
            raw.decode("utf-8")
        )


    def do_GET(self):

        path = urlparse(
            self.path
        ).path


        # ---------------- STATUS ----------------

        if path == "/api/status":

            self.send_json({
                "name":
                    "BANANOS BAR",

                "status":
                    "online",

                "server":
                    "BANANOS-LIMPIO",

                "version":
                    "3.0"
            })

            return


        # ---------------- PAGOS ----------------

        if path == "/api/payments":

            data = read_json(
                PAYMENTS_FILE,
                {'bank': 'Datos de demostración', 'card_number': '', 'holder': '', 'transfer_enabled': False, 'cash_enabled': True}
            )

            self.send_json(
                data
            )

            return


        # ---------------- MENU ----------------

        if path == "/api/menu":

            data = read_json(
                MENU_FILE,
                {
                    "categories": [],
                    "products": []
                }
            )

            self.send_json(data)

            return


        # ---------------- PROMOCIONES ----------------

        if path == "/api/promotions":

            data = read_json(
                PROMOTIONS_FILE,
                {
                    "promotions": []
                }
            )

            if not isinstance(
                data.get("promotions"),
                list
            ):

                data["promotions"] = []

            self.send_json(
                data
            )

            return


        # ---------------- MUSICA ----------------

        if path == "/api/music/requests":

            data = read_json(
                MUSIC_FILE,
                {
                    "requests": []
                }
            )

            requests = data.get(
                "requests",
                []
            )

            if not isinstance(
                requests,
                list
            ):

                requests = []

            requests = sorted(
                requests,
                key=lambda item:
                    item.get(
                        "created_at",
                        ""
                    ),
                reverse=True
            )

            self.send_json({
                "ok":
                    True,

                "requests":
                    requests,

                "count":
                    len(requests)
            })

            return


        # ---------------- ADMIN ----------------

        if path == "/admin":

            self.send_response(
                302
            )

            self.send_header(
                "Location",
                "/admin/"
            )

            self.end_headers()

            return


        # ---------------- STATIC ----------------

        super().do_GET()


    # ========================================================
    # POST
    # ========================================================

    def do_POST(self):

        path = urlparse(
            self.path
        ).path


        # ====================================================
        # ====================================================
        # POST MENU PRODUCT
        # ====================================================

        if path == "/api/menu/products":

            self.create_menu_product()

            return


        # POST PROMOCIONES
        # ====================================================

        if path == "/api/promotions":

            self.create_promotion()

            return


        # ====================================================
        # POST MUSICA
        # ====================================================

        if path == "/api/music/requests":

            self.create_music_request()

            return


        self.send_json(
            {
                "ok":
                    False,

                "error":
                    "Ruta no encontrada"
            },
            404
        )


    # ========================================================
    # CREAR PROMOCION
    # ========================================================

    def create_promotion(self):

        data = read_json(
            PROMOTIONS_FILE,
            {
                "promotions": []
            }
        )

        promotions = data.get(
            "promotions",
            []
        )

        if not isinstance(
            promotions,
            list
        ):

            promotions = []


        if len(
            promotions
        ) >= MAX_PROMOTIONS:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Solo se permiten 3 promociones."
                },
                400
            )

            return


        try:

            fields, files = (
                self.read_multipart()
            )

        except Exception as error:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        str(error)
                },
                400
            )

            return


        title = str(
            fields.get(
                "title",
                ""
            )
        ).strip()


        description = str(
            fields.get(
                "description",
                ""
            )
        ).strip()


        price = str(
            fields.get(
                "price",
                ""
            )
        ).strip()


        if not title:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Escribe un título."
                },
                400
            )

            return


        if not description:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Escribe una descripción."
                },
                400
            )

            return


        image = files.get(
            "image"
        )


        if not image:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Selecciona una imagen."
                },
                400
            )

            return


        original_name = str(
            image.get(
                "filename",
                ""
            )
        )


        image_data = image.get(
            "data",
            b""
        )


        extension = Path(
            original_name
        ).suffix.lower()


        if extension not in {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        }:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Usa JPG, PNG o WEBP."
                },
                400
            )

            return


        if not image_data:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "La imagen está vacía."
                },
                400
            )

            return


        if len(
            image_data
        ) > MAX_PROMO_IMAGE:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "La imagen supera 900 KB."
                },
                400
            )

            return


        promotion_id = (
            uuid.uuid4()
            .hex[:10]
        )


        filename = (
            f"promo-"
            f"{promotion_id}"
            f"{extension}"
        )


        destination = (
            PROMOS_DIR /
            filename
        )


        try:

            destination.write_bytes(
                image_data
            )

        except Exception as error:

            print(
                "[PROMO IMAGE ERROR]",
                error
            )

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "No se pudo guardar la imagen."
                },
                500
            )

            return


        promotion = {

            "id":
                promotion_id,

            "title":
                title,

            "description":
                description,

            "price":
                price,

            "image":
                (
                    "/assets/img/promos/"
                    + filename
                ),

            "active":
                True
        }


        promotions.append(
            promotion
        )


        data["promotions"] = (
            promotions
        )


        try:

            write_json(
                PROMOTIONS_FILE,
                data
            )

        except Exception as error:

            destination.unlink(
                missing_ok=True
            )

            print(
                "[PROMO JSON ERROR]",
                error
            )

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "No se pudo guardar la promoción."
                },
                500
            )

            return


        print(
            f"[PROMO] + "
            f"{title}"
        )


        self.send_json(
            {
                "ok":
                    True,

                "promotion":
                    promotion,

                "count":
                    len(promotions)
            },
            201
        )


    # ========================================================
    # CREAR PETICION MUSICAL
    # ========================================================

    def create_music_request(self):

        try:

            body = (
                self.read_json_body()
            )

        except Exception:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Datos inválidos"
                },
                400
            )

            return


        song = str(
            body.get(
                "song",
                ""
            )
        ).strip()[:100]


        artist = str(
            body.get(
                "artist",
                ""
            )
        ).strip()[:100]


        if not song:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Escribe el nombre de la canción."
                },
                400
            )

            return


        if not artist:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Escribe el artista."
                },
                400
            )

            return


        data = read_json(
            MUSIC_FILE,
            {
                "requests": []
            }
        )


        requests = data.get(
            "requests",
            []
        )


        if not isinstance(
            requests,
            list
        ):

            requests = []


        duplicate = any(

            str(
                item.get(
                    "song",
                    ""
                )
            ).lower()
            == song.lower()

            and

            str(
                item.get(
                    "artist",
                    ""
                )
            ).lower()
            == artist.lower()

            and

            item.get(
                "status"
            )
            == "pending"

            for item in requests
        )


        if duplicate:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Esa canción ya está en la lista 🎵"
                },
                409
            )

            return


        item = {

            "id":
                uuid.uuid4()
                .hex[:10],

            "song":
                song,

            "artist":
                artist,

            "status":
                "pending",

            "created_at":
                datetime.now()
                .isoformat(
                    timespec="seconds"
                )
        }


        requests.insert(
            0,
            item
        )


        data["requests"] = (
            requests[
                :MAX_MUSIC_REQUESTS
            ]
        )


        write_json(
            MUSIC_FILE,
            data
        )


        print(
            f"[MUSIC] + "
            f"{song} - {artist}"
        )


        self.send_json(
            {
                "ok":
                    True,

                "request":
                    item
            },
            201
        )


    # ========================================================
    # PATCH
    # ========================================================

    def do_PATCH(self):

        path = urlparse(
            self.path
        ).path


        # ====================================================
        # PATCH MENU PRODUCT
        # ====================================================

        prefix_menu = "/api/menu/products/"

        if path.startswith(prefix_menu):

            product_id = (
                path[len(prefix_menu):]
                .strip("/")
            )

            self.update_menu_product(
                product_id
            )

            return



        prefix = (
            "/api/music/requests/"
        )


        if not path.startswith(
            prefix
        ):

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Ruta no encontrada"
                },
                404
            )

            return


        request_id = (
            path[
                len(prefix):
            ]
            .strip("/")
        )


        try:

            body = (
                self.read_json_body()
            )

        except Exception:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Datos inválidos"
                },
                400
            )

            return


        data = read_json(
            MUSIC_FILE,
            {
                "requests": []
            }
        )


        found = None


        for item in data.get(
            "requests",
            []
        ):

            if (
                item.get("id")
                == request_id
            ):

                found = item
                break


        if not found:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Petición no encontrada"
                },
                404
            )

            return


        status = str(
            body.get(
                "status",
                ""
            )
        ).strip()


        if status:

            found["status"] = (
                status
            )


        write_json(
            MUSIC_FILE,
            data
        )


        self.send_json({
            "ok":
                True,

            "request":
                found
        })


    # ========================================================
    # DELETE
    # ========================================================

    def do_DELETE(self):

        path = urlparse(
            self.path
        ).path


        # ====================================================
        # DELETE MENU PRODUCT
        # ====================================================

        prefix_menu_delete = "/api/menu/products/"

        if path.startswith(prefix_menu_delete):

            product_id = (
                path[len(prefix_menu_delete):]
                .strip("/")
            )

            self.delete_menu_product(
                product_id
            )

            return



        # ====================================================
        # DELETE PROMOCION
        # ====================================================

        promo_prefix = (
            "/api/promotions/"
        )


        if path.startswith(
            promo_prefix
        ):

            promotion_id = (
                path[
                    len(promo_prefix):
                ]
                .strip("/")
            )

            self.delete_promotion(
                promotion_id
            )

            return


        # ====================================================
        # DELETE MUSICA
        # ====================================================

        music_prefix = (
            "/api/music/requests/"
        )


        if path.startswith(
            music_prefix
        ):

            request_id = (
                path[
                    len(music_prefix):
                ]
                .strip("/")
            )

            self.delete_music_request(
                request_id
            )

            return


        self.send_json(
            {
                "ok":
                    False,

                "error":
                    "Ruta no encontrada"
            },
            404
        )


    # ========================================================
    # ELIMINAR PROMOCION
    # ========================================================

    def delete_promotion(
        self,
        promotion_id
    ):

        data = read_json(
            PROMOTIONS_FILE,
            {
                "promotions": []
            }
        )


        promotions = data.get(
            "promotions",
            []
        )


        promotion = next(
            (
                item
                for item
                in promotions
                if (
                    item.get("id")
                    == promotion_id
                )
            ),
            None
        )


        if not promotion:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Promoción no encontrada."
                },
                404
            )

            return


        image_url = str(
            promotion.get(
                "image",
                ""
            )
        )


        if image_url.startswith(
            "/assets/img/promos/"
        ):

            filename = Path(
                image_url
            ).name

            image_file = (
                PROMOS_DIR /
                filename
            )

            image_file.unlink(
                missing_ok=True
            )


        data["promotions"] = [

            item

            for item
            in promotions

            if (
                item.get("id")
                != promotion_id
            )
        ]


        write_json(
            PROMOTIONS_FILE,
            data
        )


        print(
            f"[PROMO] - "
            f"{promotion_id}"
        )


        self.send_json({
            "ok":
                True,

            "count":
                len(
                    data["promotions"]
                )
        })


    # ========================================================
    # ELIMINAR MUSICA
    # ========================================================

    def delete_music_request(
        self,
        request_id
    ):

        data = read_json(
            MUSIC_FILE,
            {
                "requests": []
            }
        )


        requests = data.get(
            "requests",
            []
        )


        before = len(
            requests
        )


        data["requests"] = [

            item

            for item
            in requests

            if (
                item.get("id")
                != request_id
            )
        ]


        if len(
            data["requests"]
        ) == before:

            self.send_json(
                {
                    "ok":
                        False,

                    "error":
                        "Petición no encontrada"
                },
                404
            )

            return


        write_json(
            MUSIC_FILE,
            data
        )


        self.send_json({
            "ok":
                True
        })


# ============================================================
# START
# ============================================================


    # ========================================================
    # CREAR PRODUCTO MENU
    # ========================================================

    def create_menu_product(self):

        # ----------------------------------------------------
        # LEER FORMULARIO MULTIPART
        # ----------------------------------------------------

        try:

            fields, files = self.read_multipart()

        except Exception as error:

            print(
                "[MENU FORM ERROR]",
                error
            )

            self.send_json(
                {
                    "ok": False,
                    "error": str(error)
                },
                400
            )

            return


        # ----------------------------------------------------
        # CAMPOS
        # ----------------------------------------------------

        name = str(
            fields.get(
                "name",
                ""
            )
        ).strip()


        category = str(
            fields.get(
                "category",
                ""
            )
        ).strip()


        tag = str(
            fields.get(
                "tag",
                ""
            )
        ).strip()


        description = str(
            fields.get(
                "description",
                ""
            )
        ).strip()


        price = str(
            fields.get(
                "price",
                ""
            )
        ).strip()


        # ----------------------------------------------------
        # VALIDACIONES
        # ----------------------------------------------------

        if not name:

            self.send_json(
                {
                    "ok": False,
                    "error": "Escribe el nombre"
                },
                400
            )

            return


        if not category:

            self.send_json(
                {
                    "ok": False,
                    "error":
                        "Selecciona una categoría"
                },
                400
            )

            return


        # ----------------------------------------------------
        # LEER MENU
        # ----------------------------------------------------

        data = read_json(
            MENU_FILE,
            {
                "categories": [],
                "products": []
            }
        )


        categories = {
            item.get("id")
            for item
            in data.get(
                "categories",
                []
            )
            if item.get("active", True)
        }


        if category not in categories:

            self.send_json(
                {
                    "ok": False,
                    "error": "Categoría inválida"
                },
                400
            )

            return


        # ----------------------------------------------------
        # ID
        # ----------------------------------------------------

        product_id = uuid.uuid4().hex[:10]

        image_url = ""


        # ----------------------------------------------------
        # IMAGEN OPCIONAL
        # ----------------------------------------------------

        image = files.get(
            "image"
        )


        if image:

            original_name = str(
                image.get(
                    "filename",
                    ""
                )
            )

            image_data = (
                image.get(
                    "data",
                    b""
                )
                or b""
            )


            if original_name and image_data:

                extension = Path(
                    original_name
                ).suffix.lower()


                allowed_extensions = {
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".webp"
                }


                if extension not in allowed_extensions:

                    self.send_json(
                        {
                            "ok": False,
                            "error":
                                "Imagen inválida. Usa JPG, JPEG, PNG o WEBP."
                        },
                        400
                    )

                    return


                if len(image_data) > MAX_MENU_IMAGE:

                    self.send_json(
                        {
                            "ok": False,
                            "error":
                                "La imagen supera 2 MB."
                        },
                        400
                    )

                    return


                filename = (
                    "product-" +
                    product_id +
                    extension
                )


                destination = (
                    MENU_UPLOADS_DIR /
                    filename
                )


                try:

                    destination.write_bytes(
                        image_data
                    )

                except Exception as error:

                    print(
                        "[MENU IMAGE ERROR]",
                        error
                    )

                    self.send_json(
                        {
                            "ok": False,
                            "error":
                                "No se pudo guardar la imagen"
                        },
                        500
                    )

                    return


                image_url = (
                    "/assets/img/menu/uploads/" +
                    filename
                )


        # ----------------------------------------------------
        # PRODUCTO
        # ----------------------------------------------------

        product = {
            "id": product_id,
            "category": category,
            "name": name,
            "tag": tag,
            "description": description,
            "price": price,
            "image": image_url,
            "active": True
        }


        # ----------------------------------------------------
        # GUARDAR
        # ----------------------------------------------------

        data.setdefault(
            "products",
            []
        ).append(
            product
        )


        try:

            write_json(
                MENU_FILE,
                data
            )

        except Exception as error:

            print(
                "[MENU WRITE ERROR]",
                error
            )

            if image_url:

                try:
                    destination.unlink(
                        missing_ok=True
                    )
                except Exception:
                    pass

            self.send_json(
                {
                    "ok": False,
                    "error":
                        "No se pudo guardar el producto"
                },
                500
            )

            return


        print(
            "[MENU] +",
            name,
            "(" + product_id + ")"
        )


        self.send_json(
            {
                "ok": True,
                "product": product
            },
            201
        )



    # ========================================================
    # ACTUALIZAR PRODUCTO
    # ========================================================

    def update_menu_product(
        self,
        product_id
    ):

        try:

            body = self.read_body_json()

        except Exception:

            self.send_json(
                {
                    "ok": False,
                    "error": "JSON inválido"
                },
                400
            )

            return


        data = read_json(
            MENU_FILE,
            {
                "categories": [],
                "products": []
            }
        )


        product = next(
            (
                item
                for item
                in data.get(
                    "products",
                    []
                )
                if item.get("id")
                == product_id
            ),
            None
        )


        if not product:

            self.send_json(
                {
                    "ok": False,
                    "error": "Producto no encontrado"
                },
                404
            )

            return


        allowed = {
            "name",
            "category",
            "tag",
            "description",
            "price",
            "active"
        }


        for key in allowed:

            if key in body:

                if key == "active":

                    product[key] = bool(
                        body[key]
                    )

                else:

                    product[key] = str(
                        body[key]
                    ).strip()


        write_json(
            MENU_FILE,
            data
        )


        print(
            "[MENU] ~",
            product.get(
                "name"
            )
        )


        self.send_json({
            "ok": True,
            "product": product
        })


    # ========================================================
    # ELIMINAR PRODUCTO
    # ========================================================

    def delete_menu_product(
        self,
        product_id
    ):

        data = read_json(
            MENU_FILE,
            {
                "categories": [],
                "products": []
            }
        )


        products = data.get(
            "products",
            []
        )


        product = next(
            (
                item
                for item in products
                if item.get("id")
                == product_id
            ),
            None
        )


        if not product:

            self.send_json(
                {
                    "ok": False,
                    "error": "Producto no encontrado"
                },
                404
            )

            return


        # Solo eliminamos físicamente imágenes
        # creadas por el nuevo administrador.

        image = str(
            product.get(
                "image",
                ""
            )
        )


        prefix = (
            "/assets/img/menu/uploads/"
        )


        if image.startswith(prefix):

            filename = Path(
                image
            ).name

            image_file = (
                MENU_UPLOADS_DIR /
                filename
            )

            image_file.unlink(
                missing_ok=True
            )


        data["products"] = [

            item

            for item in products

            if item.get("id")
            != product_id
        ]


        write_json(
            MENU_FILE,
            data
        )


        print(
            "[MENU] -",
            product.get(
                "name"
            )
        )


        self.send_json({
            "ok": True
        })


if __name__ == "__main__":

    print()
    print("==========================================")
    print(" BANANOS BAR - SERVER LIMPIO V3")
    print("==========================================")
    print()
    print(" Frontend : http://localhost:8080")
    print(" Admin    : http://localhost:8080/admin/")
    print()
    print(" GET  /api/payments")
    print(" GET  /api/promotions")
    print(" POST /api/promotions")
    print(" DEL  /api/promotions/ID")
    print()
    print(" GET   /api/music/requests")
    print(" POST  /api/music/requests")
    print(" PATCH /api/music/requests/ID")
    print(" DEL   /api/music/requests/ID")
    print()
    print(" CTRL+C para detener")
    print("==========================================")
    print()

    server = ThreadingHTTPServer(
        (
            HOST,
            PORT
        ),
        BananosHandler
    )

    try:

        server.serve_forever()

    except KeyboardInterrupt:

        print(
            "\n[BANANOS] Servidor detenido."
        )

    finally:

        server.server_close()
