const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Meu Projeto',
      version: '1.0.0',
      description: 'Documentação gerada automaticamente com Swagger',
    },
  },
  apis: ['./routes/*.js'], // <-- caminho relativo às rotas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
