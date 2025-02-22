# Message Sentiment Analysis Modifier Integration

![Telex-Sentiment-Analyzer](https://github.com/user-attachments/assets/992e8737-5086-4bed-bff7-c9aecf4c3758)


## Overview
A powerful message sentiment analysis integration for Telex that uses advanced Natural Language Processing (NLP) to analyze message sentiment and flag potentially harmful content in real-time. Built with TypeScript and Express.js, this integration provides robust sentiment analysis capabilities with configurable sensitivity levels and customizable warning thresholds.

## Features
- 🔍 Real-time sentiment analysis of messages
- ⚠️ Automatic detection and flagging of potentially harmful content
- 🎚️ Configurable toxicity thresholds
- 🔄 Customizable sensitivity levels
- ⚡ Fast processing with timeout protection
- 🛡️ Comprehensive error handling
- 📊 Performance monitoring and health checks

## Prerequisites
- Node.js (v16.x or higher)
- npm or yarn
- TypeScript
- Express.js

## Installation

1. Clone the repository:
```bash
git clone https://github.com/telexintegrations/NLP-Sentiment-Analysis-Modifier-Integratio
cd NLP-Sentiment-Analysis-Modifier-Integratio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
OPENAI_API_KEY = "YOUR OPEN AI KEY"
```

4. Build the TypeScript code:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

## Configuration
The integration can be configured through the `telexConfig.ts` file, which includes:

- Application metadata
- Integration settings
- Sensitivity thresholds
- Output channels
- User permissions
- Key features

### Default Settings
```json
{
  "Toxicity Threshold": -0.5,
  "Warning Prefix": true,
  "Sensitivity Level": "Medium"
}
```

## API Endpoints

### 1. Message Analysis
```http
POST /format-message
```

#### Request Body
```typescript
{
  "channel_id": "",
  "target_url": "",
  "message": "",
  "settings": [
    {
      "label": "",
      "type": "",
      "default": ,
      "required": 
    }
  ]
}
```

#### Response
```typescript
{
  message: string;
  metadata: {
    processed: boolean;
    sentiment_score: number;
    processing_time: number;
    channel_id: string;
    target_url: string;
    timestamp: string;
    sensitivity_level: string;
  }
}
```

### 2. Configuration
```http
GET /integration.json
```
Returns the current integration configuration.

### 3. Health Check
```http
GET /health
```
Returns the service health status and metrics.

## Error Handling
The integration implements comprehensive error handling for:
- Invalid messages
- Missing channel IDs
- Invalid target URLs
- Processing timeouts
- API errors

## Performance
- Request timeout: 900ms
- Average processing time: ~100ms
- Memory usage monitoring
- Uptime tracking

## Development

### Project Structure
```
src/
├── index.ts              # Main application entry
├── analyzeSentiment.ts   # Sentiment analysis logic
├── types.ts             # TypeScript type definitions
├── telexConfig.ts       # Integration configuration
└── test/               # Test files
```

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

The compiled JavaScript will be output to the `dist/` directory.

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
For support, please:
1. Check the [documentation](docs/)
2. Open an issue
3. Contact the development team

## Author
- GLENN TANZE - *Initial work*
- BP - *Mental Support and Encouragement*

## Acknowledgments
- Telex team for the integration framework
- Contributors to the NLP libraries used in this project
