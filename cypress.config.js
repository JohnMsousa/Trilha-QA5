const { defineConfig } = require("cypress");

module.exports = defineConfig({
    projectId: "h954vu",
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        video: true, // Ativa a gravação de vídeo
        videosFolder: "cypress/videos", // Define a pasta onde os vídeos serão armazenados
    },
});
