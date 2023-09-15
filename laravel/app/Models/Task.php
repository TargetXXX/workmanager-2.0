<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Task extends Model {
    use HasFactory;

    protected $casts = [
        'due_date' => 'datetime:m/d/Y',
    ];
    

    protected $fillable = [
        'name',
        'description',
        'column',
        'staff',
        'assignee',
        'status',
        'priority',
        'due_date',
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
