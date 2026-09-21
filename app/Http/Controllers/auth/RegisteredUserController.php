<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TestResult;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    // Show Registration Page
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    //  Memproses pendaftaran user baru + sinkronisasi skor guest.
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],

            // Validasi opsional untuk hasil tes guest (jika ada)
            'wpm' => 'nullable|numeric|min:0',
            'raw_wpm' => 'nullable|numeric|min:0',
            'accuracy' => 'nullable|numeric|min:0|max:100',
            'time_elapsed' => 'nullable|numeric|gt:0',
            'word_count' => 'nullable|integer|in:10,15,20,25,30',
            'language' => 'nullable|string|in:indonesian,english,code',
        ]);

        // 1. Buat User Baru
        $baseUsername = str($request->name)
            ->slug('-')
            ->toString();

        if (blank($baseUsername)) {
            $baseUsername = str($request->email)
                ->before('@')
                ->slug('-')
                ->toString();
        }

        $baseUsername = trim(substr($baseUsername, 0, 40)) ?: 'user';
        $username = $baseUsername;
        $attempt = 1;

        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $attempt;
            $attempt++;
        }

        $user = User::create([
            'name' => $request->name,
            'username' => $username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        // 2. Auto Login
        Auth::login($user);

        // 3. Sinkronisasi Skor Guest (Jika tes dikirim saat register)
        if ($request->filled('wpm') && $request->filled('accuracy')) {
            TestResult::create([
                'user_id' => $user->id,
                'wpm' => $request->wpm,
                'raw_wpm' => $request->raw_wpm ?? $request->wpm,
                'accuracy' => $request->accuracy,
                'consistency' => $request->consistency ?? 0,
                'time_elapsed' => $request->time_elapsed ?? 15,
                'word_count' => $request->word_count ?? 30,
                'language' => $request->language ?? 'english',
                'is_pb' => true,
            ]);

            return redirect()->route('home')->with('success', 'Welcome! Your account was created and your first score was saved.');
        }

        return redirect()->route('home')->with('success', 'Welcome to BrutalType!');
    }
}
