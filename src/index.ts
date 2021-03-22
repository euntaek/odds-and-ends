import 'reflect-metadata';
import 'pg';
import App from './app';

const { PORT } = process.env;

const app = new App();

app.bootstrap(Number(PORT));
