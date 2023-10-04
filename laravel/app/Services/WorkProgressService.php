<?php

namespace App\Services;

use App\Models\WorkProgress;

class WorkProgressService
{
    public function execute(Methods $method, mixed ...$params): mixed
    {
        
        $fn = $method->name;

        return $this->$fn(...$params);

    }

    public function GET(int $id = null, int $user_id = null, int $task_id = null) {

        $query = WorkProgress::query();

        if($id) $query->where('id', $id);

        if($user_id) $query->where('user_id', $user_id);

        if($task_id) $query->where('task_id', $task_id);

        $result = $query->get();

        return response()->json($result);

    }   

    public function POST(object $request) {

        $request = WorkProgress::create([
            'user_id' => $request->user_id,
            'task_id' => $request->task_id,
            'date' => $request->date,
            'time' => $request->time,
            'horas' => $request->horas,
            'description' => $request->description,
        ]);

        return  response()->json(['progress' => $request ? $request->toArray() : null, 'success' => boolval($request)]);

    }

    public function PUT(int $id, array $request): mixed
    {

        $progress = WorkProgress::find($id);

        if($progress) $progress->update($request);

        return  response()->json(['progress' => $progress ? $progress->toArray() : null, 'success' => boolval($progress)]);
    }

    public function DELETE(int $progressId): mixed
    {
        $progress = WorkProgress::where('id', '=', $progressId)->delete();
        
        return response()->json(['success' => boolval($progress)]);
    }
}

?>