import { Application } from './application/application.ts';

const application = new Application();

await application.initialize();
await application.start();

