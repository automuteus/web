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
        // Built from API values: result and color names.
        preservePatterns: ["stats:shared.result.*", "stats:shared.color.*"],
    },
    lint: {
        // Views still to convert. Remove a file from this list once its strings go through t(); CI then keeps it clean.
        ignore: [
            "components/commands/**", "components/index/**", "components/premium/**", "data/**",
            "components/layout/AppLayout.tsx", "components/layout/ErrorLayout.tsx", "components/layout/Header.tsx", "components/layout/HeaderLink.tsx",
            "components/layout/Metadata.tsx", "components/layout/ResetPanel.tsx",
            "components/settings/SettingsView.tsx", "components/stats/GuildStatsView.tsx", "components/stats/MatchSummaryView.tsx",
            "pages/404.tsx", "pages/commands.tsx", "pages/index.tsx", "pages/premium/**", "pages/settings.tsx",
            "pages/stats.tsx", "pages/stats/match.tsx", "pages/stats/user.tsx", "pages/_document.tsx",
        ],
        checkConcatenation: "error",
    },
});
