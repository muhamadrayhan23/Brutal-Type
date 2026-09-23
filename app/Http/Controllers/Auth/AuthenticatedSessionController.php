<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\TestResult;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    // Show Login Page
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    // Authenticate User
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
                DB::transaction(function () use ($request) {
                    $userId = Auth::id();
                    $wordCount = $request->word_count ?? 10;
                    $language = $request->language ?? 'indonesian';
                    $wpm = $request->wpm;

                    // Cek apakah skor ini lebih tinggi dari PB user yang ada untuk kategori yang sama
                    $previousPb = TestResult::where('user_id', $userId)
                        ->where('word_count', $wordCount)
                        ->where('language', $language)
                        ->where('is_pb', true)
                        ->first();

                    $isPb = false;

                    if (!$previousPb) {
                        $isPb = true;
                    } elseif ($wpm > $previousPb->wpm) {
                        $previousPb->update(['is_pb' => false]);
                        $isPb = true;
                    }

                    TestResult::create([
                        'user_id' => $userId,
                        'wpm' => $wpm,
                        'raw_wpm' => $request->raw_wpm ?? $wpm,
                        'accuracy' => $request->accuracy,
                        'consistency' => $request->consistency ?? 0,
                        'time_elapsed' => $request->time_elapsed ?? 0,
                        'word_count' => $wordCount,
                        'language' => $language,
                        'key_stats' => $request->key_stats ?? null,
                        'is_pb' => $isPb,
                    ]);
                });
            }

            return redirect()->intended(route('home'));
        }

        return back()->withErrors([
            'email' => 'Incorrect email or password.',
            'password' => 'Incorrect email or password.',
        ])->onlyInput('email');
    }

    // Logout User
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
