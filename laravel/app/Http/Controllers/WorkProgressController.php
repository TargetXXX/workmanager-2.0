<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\EditRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\WorkProgressRequest;
use App\Services\Methods;
use App\Services\WorkProgressService;

class WorkProgressController extends Controller
{
    public function __construct(
        private WorkProgressService $progressService, 

    ){}

    public function create(WorkProgressRequest $request) {

        return $this->progressService->execute(Methods::POST, $request);

    }

    public function delete(int $progressId) {

        return $this->progressService->execute(Methods::DELETE, $progressId);

    }
    public function update(int $progressId, WorkProgressRequest $request) {

        return $this->progressService->execute(Methods::PUT, $progressId, $request->validated());

    }

    public function get(int $progressId = null) {

        if($progressId === null) return $this->progressService->execute(methods::GET);
        
        return $this->progressService->execute(Methods::GET, $progressId);
        
    }


}