<?php
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProjectFilesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerifyAuthController;
use App\Http\Controllers\WorkProgressController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//post
Route::post('/register', [UserController::class, 'create']);
Route::post('/login', LoginController::class);

Route::post('/register/task', [TaskController::class, 'create']);

Route::post('tasks/{task}/comments', [CommentController::class, 'store']);

Route::post('register/progress', [WorkProgressController::class, 'create']);

//delete

Route::delete('/delete/task/{id}', [TaskController::class, 'delete']);
Route::delete('/delete/user/{id}', [UserController::class, 'delete']);
Route::delete('/delete/comment/{id}', [CommentController::class, 'delete']);
Route::delete('/delete/progress/{id}', [WorkProgressController::class, 'delete']);

//put

Route::put('/edit/task/{id}', [TaskController::class, 'update']);
Route::put('/edit/user/{id}', [UserController::class, 'update']);
Route::put('/edit/comment/{id}', [CommentController::class, 'update']);
Route::put('/edit/progress/{id}', [WorkProgressController::class, 'update']);

//get
Route::get('/tasks/{task}/comments', [CommentController::class, 'index']);
Route::get('/get/tasks/{id?}', [TaskController::class, 'get']);
Route::get('/get/users/{id?}', [UserController::class, 'get']);
Route::get('/get/progress', [WorkProgressController::class, 'get']);
Route::get('/get/progress/{id}', [WorkProgressController::class, 'get']);
Route::get('/get/progress/task/{task_id}', [WorkProgressController::class, 'get']);
Route::get('/get/progress/user/{user_id}/{task_id?}', [WorkProgressController::class, 'get']);


Route::middleware('auth:sanctum')->get('/logged', VerifyAuthController::class);

Route::get('/project-files', [ProjectFilesController::class, 'index']);