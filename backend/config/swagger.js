const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Meu Projeto',
      version: '1.0.0',
      description: 'Documentação gerada automaticamente com Swagger',
    },
    components: {
      securitySchemes: {
        bearerAuth: {           // Nome do esquema de segurança
          type: 'http',        // Tipo HTTP
          scheme: 'bearer',    // Tipo do token
          bearerFormat: 'JWT', // Formato do token
        }
      }
    },
    security: [
      {
        bearerAuth: [] // Aplica o esquema globalmente a todas as rotas
      }
    ]
  },
  apis: ['./routes/*.js'], // caminho relativo às rotas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;