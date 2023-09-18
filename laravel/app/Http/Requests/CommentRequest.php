<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class CommentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'content' => 'required|string|min:4',
            'user_id' => 'nullable|integer',
        ];
    }

    
}
