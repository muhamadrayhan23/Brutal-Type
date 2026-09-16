<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('wpm');
            $table->unsignedSmallInteger('raw_wpm');
            $table->decimal('accuracy', 5, 2);
            $table->decimal('consistency', 5, 2)->default(0);
            $table->unsignedSmallInteger('word_count')->default(10);
            $table->string('language')->default('indonesian');
            $table->decimal('time_elapsed', 6, 2);
            $table->boolean('is_pb')->default(false);

            $table->json('key_stats')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Indexing agar query leaderboard dan filtering profil murni cepat
            $table->index(['word_count', 'language', 'wpm']);
            $table->index(['user_id', 'is_pb']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_results');
    }
};
