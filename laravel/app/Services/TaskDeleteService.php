<?php

namespace App\Services;

use App\Models\Task;

class TaskDeleteService
{
    public function execute(int $taskId): bool
    {
        return $this->delete($taskId);
    }

    public function delete(int $taskId): bool
    {
        $task = Task::find($taskId);

        if (!$task) {
            return false; // A tarefa não foi encontrada, portanto, não foi excluída
        }

        return $task->delete(); // Retorna true se a tarefa for excluída com sucesso
    }
}
