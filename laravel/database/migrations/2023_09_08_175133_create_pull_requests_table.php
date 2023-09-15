<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePullRequestsTable extends Migration
{
    public function up()
    {
        Schema::create('pull_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->text('title');
            $table->text('description');
            $table->timestamps();
            $table->foreign("user_id")->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pull_requests');
    }
}

