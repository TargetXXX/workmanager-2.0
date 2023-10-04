<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WorkProgressRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id',
            'task_id' => 'required|integer|exists:tasks,id',
            'date' => 'required|string',
            'horas' => 'required|string',
            'description' => 'required|string|min:4|max:500',
        ];
    }

    
}
