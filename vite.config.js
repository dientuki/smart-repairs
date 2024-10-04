import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import 'dotenv/config';
import path from 'path';
import removeAttribute from '@castlenine/vite-remove-attribute';

const isProduction = process.env.NODE_ENV == 'production';

export default defineConfig({
    build: {
        minify: isProduction ? 'esbuild' : false,
        cssMinify: isProduction,
    },
    plugins: [
        laravel({
            input: [
                'board/page.tsx',
            ],
            refresh: true,
        }),
        isProduction &&
        removeAttribute({
            extensions: ['tsx'],
            attributes: ['data-testid'],
            ignoreFolders: ['node_modules'],
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'board'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['board/setupTests.js'],
        include: ['board/**/*.test.{ts,tsx}'],  // Incluir solo los tests en la carpeta /board
        exclude: ['dist/**', 'node_modules/**'],
        coverage: {
            provider: 'v8',
            reportsDirectory: './coverage/board',
            include: ['board/**/*.test.{ts,tsx}'],
            exclude: ['dist/**', 'node_modules/**']
        }
      }
});