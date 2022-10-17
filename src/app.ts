import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import db from './config/database.config';
import cors from 'cors';

//Routes
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import banksRouter from './routes/banks';
import transactionRouter from './routes/transactions';
import withdrawalRouter from './routes/withdrawals';

//Swagger
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
// import multer from "multer"
const app = express();

// var multer = require('multer')

app.use(cors());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '..', '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', banksRouter);
app.use('/api', transactionRouter);
app.use('/api', withdrawalRouter);

const swaggerDocs = YAML.load('./documentation.yaml');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
// {force: true}
db.sync()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Database connected successfully');
  })
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// eslint-disable-next-line max-len, @typescript-eslint/no-unused-vars
app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: express.NextFunction,
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

export default app;
