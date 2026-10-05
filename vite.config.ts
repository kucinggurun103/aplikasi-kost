import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

const wayfinderCommand =
    process.env.WAYFINDER_COMMAND ??
    (process.platform === 'win32'
        ? 'php artisan wayfinder:generate'
        : 'sh -c \'php artisan wayfinder:generate "$@" || test -d resources/js/actions\' --');

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
            command: wayfinderCommand,
        }),
    ],
    build: {
        rolldownOptions: {
            output: {
                manualChunks(id: string) {
                    if (
                        id.includes('recharts') ||
                        id.includes('d3-') ||
                        id.includes('victory-vendor')
                    ) {
                        return 'vendor-charts';
                    }
                    if (id.includes('sweetalert2')) {
                        return 'vendor-swal';
                    }
                },
            },
        },
    },
});
