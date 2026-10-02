import { defineConfig } from "i18next-cli";

// English is the only language here: Crowdin writes the others (crowdin.yml), so extract never touches them.
export default defineConfig({
    locales: ["en"],
    extract: {
        input: ["components/**/*.{ts,tsx}", "pages/**/*.{ts,tsx}", "utils/**/*.{ts,tsx}", "data/**/*.{ts,tsx}"],
        output: "locales/{{language}}/{{namespace}}.json",
        primaryLanguage: "en",
        defaultNS: "stats",
        indentation: 2,
        // Keys built at runtime: results and colors from the API, command descriptions, language names.
        preservePatterns: ["stats:shared.result.*", "stats:shared.color.*", "stats:match.crewmate.colorName.*", "commands:command.*", "settings:languageName.*"],
    },
    lint: {
        // Every view goes through t(), so CI flags any new hardcoded string.
        ignore: [],
        checkConcatenation: "error",
    },
});
