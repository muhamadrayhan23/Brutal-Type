<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'wpm',
        'raw_wpm',
        'accuracy',
        'consistency',
        'word_count',
        'language',
        'time_elapsed',
        'is_pb',
        'key_stats',
    ];

    protected $casts = [
        'key_stats' => 'array',
        'accuracy' => 'float',
        'consistency' => 'float',
        'time_elapsed' => 'float',
        'is_pb' => 'boolean',
    ];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
