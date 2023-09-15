<?php

namespace App\Services;

use App\Models\Task; 
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Carbon\Carbon;

class TaskCreateService
{
    public function execute(object $request): array
    {
        $task = $this->create($request);

        return $task;
    }

    public function create(object $request): array
    {
        
        if (isset($request->due_date)) {
            $carbonDueDate = Carbon::createFromFormat('d-m-Y', $request->due_date);

            if ($carbonDueDate !== false) {
                $mysqlFormattedDueDate = $carbonDueDate->format('Y-m-d');
                $request->due_date = $mysqlFormattedDueDate;
            } else {
                $request->due_date = null;
            }
        } else {
            $request->due_date = null;
        }

        $task = Task::create([
            'name' => $request->name,
            'description' => $request->description,
            'staff' => $request->staff,
            'assignee' => $request->assignee,
            'status' => $request->status,
            'priority' => $request->priority,
            'due_date' => $request->due_date,
            'completed_at' => $request->completed_at,
        ]);

        return $task->toArray();
    }
}
