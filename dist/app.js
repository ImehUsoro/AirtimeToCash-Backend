"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const database_config_1 = __importDefault(require("./config/database.config"));
const cors_1 = __importDefault(require("cors"));
//Routes
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const banks_1 = __importDefault(require("./routes/banks"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const withdrawals_1 = __importDefault(require("./routes/withdrawals"));
//Swagger
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
// import multer from "multer"
const app = express_1.default();
// var multer = require('multer')
app.use(cors_1.default());
app.use(morgan_1.default('dev'));
app.use(express_1.default.static(path_1.default.join(__dirname, '..', '../public')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use('/', index_1.default);
app.use('/users', users_1.default);
app.use('/api', banks_1.default);
app.use('/api', transactions_1.default);
app.use('/api', withdrawals_1.default);
const swaggerDocs = yamljs_1.default.load('./documentation.yaml');
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// {force: true}
database_config_1.default.sync()
    .then(() => {
    // eslint-disable-next-line no-console
    console.log('Database connected successfully');
})
    // eslint-disable-next-line no-console
    .catch((err) => console.log(err));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(http_errors_1.default(404));
});
// error handler
// eslint-disable-next-line max-len, @typescript-eslint/no-unused-vars
app.use(function (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
});
exports.default = app;
//# sourceMappingURL=app.js.map