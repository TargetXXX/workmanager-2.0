<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\users;
use Carbon\Carbon;

class TaskUpdateService
{
    public function execute(int $id, $request): mixed
    {

        $file = $this->update($id, $request);

        return $file;
    }

    public function update(int $id, $request): mixed
    {

        $task = Task::find($id);

        if(isset($request["due_date"])) {
            

            $carbonDueDate = Carbon::createFromFormat('d-m-Y', $request["due_date"]);

            if($carbonDueDate !== false) {
                $mysqlFormattedDueDate = $carbonDueDate->format('Y-m-d');

                $request["due_date"] = $mysqlFormattedDueDate;
                
            } else {
                $request["due_date"] = null;
            }

        }

        if($task) $task->update($request);

        return  $task->toArray();
    }
}
