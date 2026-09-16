<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TypingTestController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// Halaman utama (welcome blade) — akan diganti route Inertia 'home' nantinya
Route::get('/', fn() => Inertia::render('Home'))->name('home');
Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard');
Route::post('/typing-test/results', [TypingTestController::class, 'store'])->name('typing.results.store');

Route::middleware('auth')->group(function () {
    Route::get('/stats', [ProfileController::class, 'show'])->name('stats');
    Route::get('/profile', fn() => redirect()->route('profile.option'))->name('profile');
    Route::get('/profile/option', [ProfileController::class, 'option'])->name('profile.option');
    Route::post('/profile/option', [ProfileController::class, 'update'])->name('profile.option.update');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'destroyAvatar'])->name('profile.avatar.destroy');
});

// ===== Auth (Guest) =====
Route::middleware('guest')->group(function () {
    // Halaman
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');

    // Aksi
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// ===== Logout (wajib login) =====
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');
