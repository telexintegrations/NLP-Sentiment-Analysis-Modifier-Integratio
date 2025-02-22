# Telex Sentiment Modifier Integration

![Telex-Sentiment-Analyzer](https://github.com/user-attachments/assets/48e45fe7-0419-4aa0-87fd-1db2fb061dcc)


This project is a **Telex integration** that analyzes the sentiment of incoming messages and modifies them based on predefined rules. It uses **Amazon Comprehend** for sentiment analysis and is designed to work with Telex's channel-based messaging system.

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Setup](#setup)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Configuration](#configuration)
5. [Usage](#usage)
   - [API Endpoints](#api-endpoints)
   - [Example Requests](#example-requests)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)

---

## Overview

The **Telex Sentiment Modifier Integration** is a backend service that:
- Receives messages from Telex channels.
- Analyzes the sentiment of the messages using **Amazon Comprehend**.
- Modifies the messages based on sentiment scores and predefined rules (e.g., adding warnings for toxic messages).
- Sends the modified messages back to the Telex channel.

This integration is designed to help teams monitor and moderate messages in real-time, ensuring a safe and productive environment.

---

## Features

- **Sentiment Analysis**: Uses Amazon Comprehend to analyze the sentiment of messages.
- **Toxicity Detection**: Flags potentially harmful messages based on a configurable toxicity threshold.
- **Customizable Settings**: Allows users to configure toxicity thresholds, sensitivity levels, and more.
- **Real-Time Processing**: Processes messages in real-time and returns modified messages to the channel.
- **Health Checks**: Provides a health check endpoint to monitor the status of the integration and AWS connectivity.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **AWS Services**: Amazon Comprehend (for sentiment analysis)
- **Libraries**:
  - `@aws-sdk/client-comprehend`: AWS SDK for interacting with Amazon Comprehend.
  - `dotenv`: For managing environment variables.
  - `cors`: For enabling Cross-Origin Resource Sharing (CORS).
  - `express-rate-limit`: For rate limiting API requests.
- **Testing**: Axios (for API testing), Postman

---

## Setup

### Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [AWS Account](https://aws.amazon.com/) (for Amazon Comprehend)
- [Telex Account](https://telex.im/) (for testing the integration)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/telexintegrations/NLP-Sentiment-Analysis-Modifier-Integratio.git
   cd NLP-Sentiment-Analysis-Modifier-Integratio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   PORT=3000
   AWS_ACCESS_KEY_ID=your-aws-access-key-id
   AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
   AWS_REGION=us-east-1
   ```

### Configuration

- **AWS Credentials**: Ensure your AWS credentials have access to Amazon Comprehend.
- **Telex Configuration**: Update the `telexConfig.json` file with your Telex integration settings.

---

## Usage

### API Endpoints

| Endpoint              | Method | Description                                                                 |
|-----------------------|--------|-----------------------------------------------------------------------------|
| `/format-message`     | POST   | Receives a message, analyzes sentiment, and returns the modified message.   |
| `/health`             | GET    | Returns the health status of the integration and AWS connectivity.          |
| `/integration.json`   | GET    | Returns the Telex integration configuration.                                |

### Example Requests

#### 1. Analyze and Modify a Message
**Request**:
```bash
POST /format-message
Content-Type: application/json

{
  "channel_id": "support-team",
  "message": "This product is terrible!",
  "target_url": "https://telex.example.com/webhooks/support-team",
  "settings": [
    {
      "label": "Toxicity Threshold",
      "type": "number",
      "default": -0.5
    }
  ]
}
```

**Response**:
```json
{
  "message": "⚠️ Potentially harmful message detected (sentiment: -0.75): This product is terrible!",
  "metadata": {
    "processed": true,
    "sentiment_score": -0.75,
    "processing_time": 500,
    "channel_id": "support-team",
    "target_url": "https://telex.example.com/webhooks/support-team",
    "timestamp": "2023-10-15T12:00:00.000Z",
    "sensitivity_level": "-0.75",
    "detailed_sentiment": {
      "sentiment": "NEGATIVE",
      "scores": {
        "positive": 0.1,
        "negative": 0.8,
        "neutral": 0.1,
        "mixed": 0.0
      }
    }
  }
}
```

#### 2. Health Check
**Request**:
```bash
GET /health
```

**Response**:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 123.45,
  "memory": {
    "rss": 12345678,
    "heapTotal": 1234567,
    "heapUsed": 123456,
    "external": 12345
  },
  "timestamp": "2023-10-15T12:00:00.000Z",
  "aws_status": "connected"
}
```

---

## Testing

To test the integration, you can use the provided `test.ts` file or tools like Postman.

1. Start the server:
   ```bash
   npm start
   ```

2. Run the tests:
   ```bash
   npm test
   ```

---

## Deployment

To deploy the integration, follow these steps:

1. **Build the Project**:
   ```bash
   npm run build
   ```

2. **Deploy to a Server**:
   - Use a platform like [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/), [Heroku](https://www.heroku.com/), or [Vercel](https://vercel.com/).

3. **Set Environment Variables**:
   - Ensure the `.env` variables are set in your deployment environment.

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Amazon Comprehend](https://aws.amazon.com/comprehend/) for sentiment analysis.
- [Telex](https://telex.im/) for the integration framework.
- My Sweet BP ❤️ - Moral Support

---
## Author
Glenn Tanze aka Glenzzy
