<?php

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PullRequest;

class PullRequestController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $user = auth()->user();

        $pullRequest = PullRequest::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'user_id' => $user->id,
        ]);

        return response()->json(['pullRequest' => $pullRequest ? $pullRequest->toArray() : null, 'success' => boolval($pullRequest)]);
    }

    public function index()
    {
        $pullRequests = PullRequest::all();
    
        return response()->json(['pullRequests' => $pullRequests]);
    }
    

    public function show($id)
    {
        $pullRequest = PullRequest::find($id);
    
        if (!$pullRequest) {
            return response()->json(['error' => 'Solicitação de código não encontrada'], 404);
        }
    
        return response()->json(['pullRequest' => $pullRequest]);
    }
    

    public function review(Request $request, $id)
    {
        $user = auth()->user();
        $pullRequest = PullRequest::find($id);
    
        if (!$pullRequest) {
            return response()->json(['error' => 'Solicitação de código não encontrada'], 404);
        }
    

        if ($user->group >= 10) {
            $pullRequest->reviewed = true;
            $pullRequest->reviewer_id = $user->id;
            $pullRequest->save();
    
            return response()->json(['message' => 'Revisão concluída com sucesso']);
        } else {
            return response()->json(['error' => 'Você não tem permissão para revisar esta solicitação'], 403);
        }
    }
    
}

