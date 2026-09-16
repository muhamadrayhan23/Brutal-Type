<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTypingTestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'wpm' => ['required', 'integer', 'min:0', 'max:65535'],
            'raw_wpm' => ['required', 'integer', 'min:0', 'max:65535'],
            'accuracy' => ['required', 'numeric', 'between:0,100'],
            'consistency' => ['required', 'numeric', 'between:0,100'],
            'word_count' => ['required', 'integer', 'in:10,15,20,25,30'],
            'language' => ['required', 'string', 'in:indonesian,english,code'],
            'time_elapsed' => ['required', 'numeric', 'gt:0', 'lte:9999.99'],
            'key_stats' => ['nullable', 'array'],
            'local_pb' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:65535'],
        ];
    }
}
