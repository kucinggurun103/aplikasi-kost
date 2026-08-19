<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="bg-slate-50 text-slate-900">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- Default SEO & Open Graph Meta Tags -->
        <meta name="description" content="Platform terbaik untuk mencari, memesan, dan mengelola kost. Mudah, aman, dan nyaman.">
        <meta property="og:title" content="{{ config('app.name', 'Cozqta - Manajemen Kost') }}">
        <meta property="og:description" content="Platform terbaik untuk mencari, memesan, dan mengelola kost. Mudah, aman, dan nyaman.">
        <meta property="og:image" content="{{ asset('pavicon.png') }}">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary_large_image">

        <link rel="icon" href="/pavicon.png" type="image/png">
        <link rel="apple-touch-icon" href="/pavicon.png">
        
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link rel="dns-prefetch" href="https://fonts.bunny.net">
        <link rel="dns-prefetch" href="https://images.unsplash.com">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
