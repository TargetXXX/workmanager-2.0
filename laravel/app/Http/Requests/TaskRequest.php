<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class TaskRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'description' => 'required|string|max:5000',
            'staff' => 'required|integer|exists:users,id', 
            'assignee' => 'nullable|integer|exists:users,id', 
            'status' => 'nullable|integer',
            'priority' => 'integer', 
            'due_date' => 'nullable|nullable_date_format', 
            'completed_at' => 'nullable|date', 
        ];
    }
}
