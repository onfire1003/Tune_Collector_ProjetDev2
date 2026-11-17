/*
-----------------------------------------------------------------------------------------------------------------------
file name           :   server.js
author              :   Joel Cunha Faria
creation date       :   17.11.2026
modification date   :   17.11.2026
-----------------------------------------------------------------------------------------------------------------------
*/

import { createApp } from './app.js';

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
    console.log(`Tune Collector API démarrée sur le port ${PORT}`);
});