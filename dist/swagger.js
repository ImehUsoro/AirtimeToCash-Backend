"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Airtime-to-Cash App',
            version: '1.0.0',
            description: 'A Call-Credit to Cash Conversion App using Swagger Documentation',
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Development Server',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'username', 'email', 'phoneNumber', 'password'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'The id of the user',
                        },
                        firstName: {
                            type: 'string',
                            description: 'The firstName of the user',
                        },
                        lastName: {
                            type: 'string',
                            description: 'The lastName of the user',
                        },
                        username: {
                            type: 'string',
                            description: 'The username of the user',
                        },
                        email: {
                            type: 'string',
                            description: 'The email of the user',
                        },
                        password: {
                            type: 'string',
                            description: 'The password of the user',
                        },
                        phoneNumber: {
                            type: 'string',
                            description: 'The phoneNumber of the user',
                        },
                        avatar: {
                            type: 'string',
                            description: 'The avatar image of the user',
                        },
                        walletBalance: {
                            type: 'number',
                            description: 'The wallet balance of the user',
                        },
                        role: {
                            type: 'string',
                            description: 'The role of the user',
                        },
                        isVerified: {
                            type: 'boolean',
                            description: 'The verification status of the user',
                        },
                        otp: {
                            type: 'number',
                            description: 'The otp of the user',
                        },
                        otpExpiration: {
                            type: 'string',
                            description: 'The otpExpiration of the user',
                        },
                    },
                },
            },
            responses: {
                400: {
                    description: 'Bad Request! Missing or False API key - include it in the Authorization header',
                    contents: 'application/json',
                },
                409: {
                    description: 'Conflict! Already existing inputs',
                    contents: 'application/json',
                },
                404: {
                    description: 'Not Found!',
                    contents: 'application/json',
                },
                500: {
                    description: 'Server Error',
                    contents: 'application/json',
                },
            },
        },
    },
    apis: ['./src/routes/**.ts']
};
exports.default = options;
//# sourceMappingURL=swagger.js.map