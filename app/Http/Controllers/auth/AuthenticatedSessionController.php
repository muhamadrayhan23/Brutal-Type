<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\TestResult;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Menampilkan halaman login.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Memproses autentikasi login.
     */
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            // Simpan skor guest jika login sambil membawa hasil tes
            if ($request->filled('wpm') && $request->filled('accuracy')) {
                TestResult::create([
                    'user_id' => Auth::id(),
                    'wpm' => $request->wpm,
                    'raw_wpm' => $request->raw_wpm ?? $request->wpm,
                    'accuracy' => $request->accuracy,
                    'consistency' => $request->consistency ?? 0,
                    'time_elapsed' => $request->time_elapsed ?? 15,
                    'word_count' => $request->word_count ?? 30,
                    'language' => $request->language ?? 'english',
                    'is_pb' => true,
                ]);
            }

            return redirect()->intended(route('home'));
        }

        return back()->withErrors([
            'email' => 'Kredensial yang dimasukkan tidak cocok dengan data kami.',
        ])->onlyInput('email');
    }

    /**
     * Memproses logout user.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
