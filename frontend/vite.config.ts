import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: "::",
        port: 8080,
    },
    plugins: [react()], // Only React plugin is included
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});