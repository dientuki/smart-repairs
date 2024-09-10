import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import 'dotenv/config';
import path from 'path';

export default defineConfig({
    build: {
        minify: process.env.APP_ENV === 'production' ? 'esbuild' : false,
        cssMinify: process.env.APP_ENV === 'production',
    },
    plugins: [
        laravel({
            input: [
                'board/page.tsx',
                'resources/sass/app.scss',
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'board'),
        },
    },
});