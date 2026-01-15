<?php

use App\Http\Controllers\AboutController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/*
|--------------------------------------------------------------------------
| Portfolio Routes
|--------------------------------------------------------------------------
|
| Futuristic Portfolio - Public Routes
|
*/

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// About page with dynamic data
Route::get('/about', [AboutController::class, 'index'])->name('about');

Route::get('/projects', function () {
    return Inertia::render('Projects');
})->name('projects');

Route::get('/services', function () {
    return Inertia::render('Services');
})->name('services');

Route::get('/blog', function () {
    return Inertia::render('Blog');
})->name('blog');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

/*
|--------------------------------------------------------------------------
| Auth Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
