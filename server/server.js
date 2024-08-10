import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";
mercadopago.configurations.setAccessToken("APP_USR-1589310844045442-080822-4cb40ca4d0be25699b59b8fe8860cc2f-299264870");
import { MercadoPagoConfig, Preference } from "mercadopago";
import { access } from "fs";

const client = new MercadoPagoConfig({
    accessToken: "APP_USR-1589310844045442-080822-4cb40ca4d0be25699b59b8fe8860cc2f-299264870",
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Soy el server");
});

app.post("/create_preference", async (req, res) => {
    try {
        const preference = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                success: "http://localhost:3000/success",
                failure: "http://localhost:3000/failure",
                pending: "http://localhost:3000/pending",
            },
            auto_return: "approved",
        };

        const response = await mercadopago.preferences.create(preference);
        res.json({
            id: response.body.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia",
        });
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})