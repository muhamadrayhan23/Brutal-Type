<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use App\Models\TestResult;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user();
        $tests = $user->testResults()
            ->latest('created_at')
            ->paginate(10)
            ->withQueryString();
        $allTests = $user->testResults();
        $totalTests = $allTests->count();
        return Inertia::render('Profile/Show', [
            'user' => $user->only(['id', 'name', 'email', 'pb_wpm', 'created_at']) + ['avatar_url' => $user->avatar_url],
            'recentTests' => $tests,
            'history' => $allTests->get()->map(fn(TestResult $test): array => [
                'wpm' => (float) $test->wpm,
                'rawWpm' => (float) $test->raw_wpm,
                'accuracy' => (float) $test->accuracy,
                'language' => $test->language,
            ])->values(),
            'stats' => [
                'totalTests' => $totalTests,
                'averageWpm' => $totalTests ? (int) $allTests->avg('wpm') : null,
                'highestWpm' => $totalTests ? (int) $allTests->max('wpm') : null,
                'totalTime' => $totalTests ? (int) ceil($allTests->sum('time_elapsed') / 60) : null,
            ],
        ]);
    }

    public function option(Request $request): Response
    {
        return Inertia::render('Profile/Option', [
            'status' => session('status'),
            'user' => $request->user()->only(['id', 'name', 'email', 'avatar']) + ['avatar_url' => $request->user()->avatar_url],
        ]);
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'status' => session('status'),
            'user' => $request->user()->only(['id', 'name', 'email', 'avatar']) + ['avatar_url' => $request->user()->avatar_url],
        ]);
    }

    /**
     * Update profil & ganti/timpa avatar lama
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($request->filled('new_password')) {
            $request->validate([
                'current_password' => ['required', 'current_password'],
                'new_password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);
            $user->password = $request->new_password;
        }

        if ($request->hasFile('avatar')) {
            // HAPUS FOTO LAMA: Jika ada foto fisik di storage, hapus dulu agar tidak menumpuk
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // SIMPAN FOTO BARU: Simpan ke folder 'profile'
            $path = $request->file('avatar')->store('profile', 'public');
            $user->avatar = $path;
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        return Redirect::route('home')->with('success', 'Profile updated successfully!');
    }

    /**
     * Khusus Hapus Avatar saja (Kembali ke default)
     */
    public function destroyAvatar(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            // Hapus file fisik di folder storage/app/public/profile
            Storage::disk('public')->delete($user->avatar);
        }

        // Set kolom avatar di database jadi null
        $user->avatar = null;
        $user->save();

        return Redirect::route('home')->with('success', 'Profile photo deleted successfully!');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
