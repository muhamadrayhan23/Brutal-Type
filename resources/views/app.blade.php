<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'BrutalType') }}</title>
    <link rel="icon" href="{{ asset('logo/BrutalType.png') }}" sizes="32x32" type="image/png">
    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>

<body class="bg-white antialiased text-black">
    @inertia
</body>

</html>
