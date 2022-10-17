"use strict";
/* eslint-disable no-undef */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbTest = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize('app', '', '', {
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
});
exports.dbTest = new sequelize_1.Sequelize('app', '', '', {
    dialect: 'sqlite',
    storage: ':memory',
    logging: false,
});
exports.default = process.env.NODE_ENV === 'test' ? exports.dbTest : db;
//# sourceMappingURL=database.config.js.map