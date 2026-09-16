<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTypingTestRequest;
use App\Models\TestResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class TypingTestController extends Controller
{
    public function store(StoreTypingTestRequest $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validated();

        if (! $request->user()) {
            $localBest = $validated['local_pb'] ?? null;
            $isPb = $localBest === null || (float) $validated['wpm'] > (float) $localBest;

            return $this->respond($request, [
                'status' => 'success',
                'saved' => false,
                'is_pb' => $isPb,
            ], 200);
        }

        $user = $request->user();
        $isPb = DB::transaction(function () use ($user, $validated): bool {
            $user->newQuery()->whereKey($user->id)->lockForUpdate()->firstOrFail();

            $category = TestResult::query()
                ->where('user_id', $user->id)
                ->where('word_count', $validated['word_count'])
                ->where('language', $validated['language']);

            $previousBest = (clone $category)->lockForUpdate()->max('wpm');
            $isPb = $previousBest === null || (int) $validated['wpm'] > (int) $previousBest;

            if ($isPb) {
                (clone $category)->where('is_pb', true)->update(['is_pb' => false]);
            }

            TestResult::query()->create([
                'user_id' => $user->id,
                'wpm' => $validated['wpm'],
                'raw_wpm' => $validated['raw_wpm'],
                'accuracy' => $validated['accuracy'],
                'consistency' => $validated['consistency'],
                'word_count' => $validated['word_count'],
                'language' => $validated['language'],
                'time_elapsed' => $validated['time_elapsed'],
                'is_pb' => $isPb,
                'key_stats' => $validated['key_stats'] ?? null,
            ]);

            return $isPb;
        });

        return $this->respond($request, [
            'status' => 'success',
            'saved' => true,
            'is_pb' => $isPb,
        ], 201);
    }

    /**
     * Inertia form submissions need a redirect, while API clients receive JSON.
     *
     * @param  array{status: string, saved: bool, is_pb: bool}  $payload
     */
    private function respond(StoreTypingTestRequest $request, array $payload, int $status): JsonResponse|RedirectResponse
    {
        if ($request->expectsJson()) {
            return response()->json($payload, $status);
        }

        return back()->with('typing_result', $payload);
    }
}
