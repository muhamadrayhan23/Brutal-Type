<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * Root template yang digunakan pada saat render pertama kali.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Menentukan versi aset aplikasi (untuk penanganan cache reload jika ada update build).
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Data global yang dibagikan secara otomatis ke seluruh komponen React/Inertia.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // Data Autentikasi User
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'avatar_url' => $request->user()->avatar_url,
                ] : null,
            ],

            // Flash Messages (untuk notifikasi sukses/error)
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'typing_result' => fn() => $request->session()->get('typing_result'),
            ],

            // Nama Aplikasi
            'appName' => config('app.name', 'BrutalType'),
        ]);
    }
}
