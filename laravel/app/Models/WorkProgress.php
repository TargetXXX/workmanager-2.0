<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkProgress extends Model
{

    protected $fillable = [
        'user_id',
        'task_id',
        'date',
        'time',
        'horas',
        'description',
    ];

    use HasFactory;
}
