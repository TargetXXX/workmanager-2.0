<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectFilesController extends Controller
{
    public function index()
    {

        $files = Storage::disk('public')->files();
        var_dump($files);
        $projectFiles = [];
        foreach ($files as $file) {
            $fileName = basename($file);
            $fileContent = Storage::disk('public')->get($file);
            $projectFiles[] = [
                'name' => $fileName,
                'content' => $fileContent,
            ];
        }

        return response()->json($projectFiles);
    }
}
