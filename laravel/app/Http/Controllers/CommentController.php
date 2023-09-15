<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
use App\Models\Comment;
use App\Models\Task;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(CommentRequest $request, Task $task) {

        
        $comment = Comment::create([
            "content" =>  $request['content'],
            "user_id" => auth()->id() ?? $request['user_id'],
            "task_id" => $task->id,
            "edited" => 'false',
        ]);
        return response()->json($comment->toArray());
    }

    public function index(Request $request) {
        $task = Task::find($request->task);

        if(!$task) {
            return response()->json(["message" => "Task não encontrada"]);
        }

        $result = Comment::where('task_id', $task->id)->get();
        $commentsArray = $result->map(function ($comment) {
            return [
                'id' => $comment->id,
                'task_id' => $comment->task_id,
                'user_id' => $comment->user_id,
                'content' => $comment->content,
                'created_at' => $comment->created_at,
                'updated_at' => $comment->updated_at,
                'edited' => $comment->edited,
            ];
        })->all();

        return response()->json($commentsArray);
    }

    public function delete(int $commentId) {

        $comment = Comment::where('id', '=', $commentId)->delete();
        
        return response()->json(['success' => boolval($comment)]);
    }


    public function update(int $commentId, CommentRequest $request) {


        $comment = Comment::find($commentId);

        if(isset($request["user_id"])) $comment["user_id"] = $request["user_id"];

        $comment["content"] = $request["content"];
        $comment["edited"] = true;

        if($comment) $comment->update($comment->toArray());
    
        return  response()->json(['Comment' => $comment ? $comment->toArray() : null, 'success' => boolval($comment)]);

    }
}