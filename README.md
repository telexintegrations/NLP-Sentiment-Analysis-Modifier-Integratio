# Telex Sentiment Modifier API

## 📌 Overview
The **Telex Sentiment Modifier API** is a simple RESTful service that processes user-submitted messages, analyzes their sentiment, and applies a modification if the sentiment score falls below a defined toxicity threshold. The API is built using **Express.js** and integrates sentiment analysis to determine if a message is potentially harmful.

## 🚀 Features
- Accepts user messages via a `POST` request.
- Analyzes sentiment using a scoring system.
- Modifies messages based on a **Toxicity Threshold**.
- Ensures a response time within **900ms**.
- Supports **CORS** and **JSON payloads**.
- Includes a **health check endpoint**.

---

## 🛠️ Installation & Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js** (>= 14.x recommended)
- **npm** or **yarn**

### Clone the Repository
```sh
git clone https://github.com/telexintegrations/NLP-Sentiment-Analysis-Modifier-Integratio
cd NLP-Sentiment-Analysis-Modifier-Integratio
```

### Install Dependencies
```sh
npm install
```

### Environment Configuration
Create a `.env` file in the project root and set the following:
```env
PORT=3000
OPENAI_API_KEY = "your-api-key"
```

### Running the Server
```sh
npm start
```
The server will start on `http://localhost:3000` (or the port specified in `.env`).

---

## 📡 API Endpoints

### 🔹 `POST /target_url`
**Description:** Processes a message and applies sentiment-based modifications if needed.

#### Request Body
```json
{
  "message": "I absolutely love this product! It's amazing!",
  "settings": [
    {
      "label": "Toxicity Threshold",
      "type": "number",
      "default": -0.5,
      "required": true
    }
  ]
}
```

#### Response (Example)
```json
{
  "message": "I absolutely love this product! It's amazing!"
}
```
If the sentiment score is below the threshold:
```json
{
  "message": "⚠️ Potentially harmful message detected (sentiment: -0.8): This is terrible! I hate everything about it!"
}
```

#### Possible Responses
| Status Code | Description |
|-------------|-------------|
| `200 OK` | Message processed successfully |
| `400 Bad Request` | Missing or invalid `message` field |

---

### 🔹 `GET /health`
**Description:** Simple health check to verify that the service is running.

#### Response
```json
{
  "status": "ok"
}
```

---

## 🧪 Running Tests
This project includes an automated test script to validate the API.

### Run Tests
```sh
npm test
```
This will send test payloads and verify API responses.

---

## 🏗️ Project Structure
```
📁 telex-sentiment-modifier
│-- 📄 index.ts (Main API logic)
│-- 📄 analyzeSentiment.ts (Sentiment analysis function)
│-- 📄 types.ts (TypeScript type definitions)
│-- 📄 test.ts (Integration test script)
│-- 📄 package.json (Dependencies & scripts)
│-- 📄 tsconfig.json (TypeScript configuration)
│-- 📄 .env (Environment variables)
```

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to your branch (`git push origin feature-name`).
5. Create a pull request.

---

## ✉️ Contact
For any inquiries or support, please reach out via [tanzeglenn@gmail.com].

Happy coding! 🎉

