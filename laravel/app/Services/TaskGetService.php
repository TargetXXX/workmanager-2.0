<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\users;
use Carbon\Carbon;

class TaskGetService
{
    public function execute(int $taskId = null): mixed
    {

        if($taskId === null) return $this->get();


        return $this->get($taskId);

    }

    public function get(int $taskId = null): mixed
    {

        if($taskId === null) return Task::orderBy('priority', 'DESC')->get();

        $task = Task::find($taskId);
        $task->due_date = $task->due_date ? Carbon::parse($task->due_date)->format('m/d/Y') : null;
        return $task;

    }
}
