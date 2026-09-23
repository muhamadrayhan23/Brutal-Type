<?php

namespace App\Http\Controllers;

use App\Models\TestResult;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderBoardController extends Controller
{
    /**
     * Menampilkan halaman Leaderboard beserta data ranking.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'word_count' => ['sometimes', 'integer', 'in:10,15,20,25,30'],
            'language' => ['sometimes', 'string', 'in:indonesian,english,code'],
        ]);

        $wordCount = (int) ($validated['word_count'] ?? 10);
        $language = $validated['language'] ?? 'indonesian';

        $leaderboards = TestResult::query()
            ->select(['id', 'user_id', 'wpm', 'accuracy', 'created_at'])
            ->where('word_count', $wordCount)
            ->where('language', $language)
            ->where('is_pb', true)
            ->with('user:id,name,avatar')
            ->orderByDesc('wpm')
            ->orderByDesc('accuracy')
            ->orderBy('created_at')
            ->limit(50)
            ->get()
            ->map(function ($result, $index) {
                return [
                    'rank' => $index + 1,
                    'user' => [
                        'id' => $result->user?->id,
                        'name' => $result->user?->name ?? 'Anonymous',
                        'avatar_url' => $result->user?->avatar_url,
                    ],
                    'wpm' => (float) $result->wpm,
                    'accuracy' => (float) $result->accuracy,
                    'created_at' => $result->created_at,
                ];
            });

        return Inertia::render('Leaderboard', [
            'leaderboards' => $leaderboards,
            'filters' => [
                'word_count' => $wordCount,
                'language' => $language,
            ],
        ]);
    }
}
