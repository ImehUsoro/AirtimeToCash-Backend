"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("../app"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const supertest_1 = __importDefault(require("supertest"));
const request = supertest_1.default(app_1.default);
describe('it should create auser', () => {
    it('should create a user', async () => {
        const response = await request.post('/users/register').send({
            firstName: 'Imeh',
            lastName: 'Usoro',
            username: 'imeh_usoro',
            email: 'imeusoro@yahoo.com',
            phoneNumber: '09093215077',
            password: bcryptjs_1.default.hashSync('1111', 8),
        });
        // expect(response.status).toBe(201);
        expect(response.body.message).toBe('user created successfully');
        expect(response.body).toHaveProperty('record');
    });
});
//# sourceMappingURL=app.test.js.map