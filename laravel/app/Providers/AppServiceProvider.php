<?php

namespace App\Providers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
           Validator::extend('nullable_date_format', function ($attribute, $value, $parameters, $validator) {
        if ($value === 'NaN-NaN-NaN') {
            return true; // Trata como válido quando o campo está vazio
        }
        
        return \DateTime::createFromFormat('d-m-Y', $value) !== false;
    });
    }
}
