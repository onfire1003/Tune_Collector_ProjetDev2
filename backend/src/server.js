/*
-----------------------------------------------------------------------------------------------------------------------
file name           :   server.js
author              :   Joel Cunha Faria
creation date       :   17.11.2026
modification date   :   24.11.2026
-----------------------------------------------------------------------------------------------------------------------
*/

import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.port, () => {
    console.log(`Tune Collector API démarrée sur http://localhost:${env.port}`);
});
