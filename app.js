import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


const context = ` Eres un asistente para un supermercado.
  informacion del negocio:
  - Ubicación: Calle desconocida numero 0 . Segovia
  - Horario: Lunes a Sabado de 8:00 a 20:00, domingos de 9:00 a 14:00
  - Productos: Pan , Leche , Huevos , Verduras , Carnes y bebidas
  - Marcas: Pascual , Asturiana , Fanta , pepsi
  - Metodos de pago: Efectivo, Tarjeta y Bizum

  Solo puedes responder preguntas sobre el negocio, cualquier otra pregunta está prohibida.
  `;

let conversations = {};






// ruta 

app.post("/api/chatbot", async (req, res) => {




  // recibit pregunta del usuario 


  const { message, userId } = req.body;



  if (!message) return res.status(404).json({ error: "Has mandado un dato erroneo" });



  if (!conversations[userId]) {
    conversations[userId] = [];
  }


  conversations[userId].push({ role: "user", content: message });


  // peticion al modelo de ia 

  try {

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: context },
        { role: "system", content: "Debes responder de la forma mas corta posible y directa, usando los minimos tokens posibles" },
        ...conversations[userId]
      ],
      max_tokens: 150
    });







    // devolver respuesta



    const reply = response.choices[0].message.content;



    conversations[userId].push({ role: "assistant", content: reply });

    if (conversations[userId].length > 12) {
      conversations[userId] = conversations[userId].slice(-10);
    }

    console.log(conversations);
    


    return res.status(200).json({ reply })

  } catch (error) {
    console.log("error:", error);
    res.status(500).json({
      error: "Error al generar la respuesta"
    })

  }



});



app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT} 🚀`);
});
