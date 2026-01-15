<?php

use App\Http\Controllers\Admin\AboutProfileController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\SkillCategoryController;
use App\Http\Controllers\Admin\SkillController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here are the routes for the admin dashboard. All routes are protected
| by the auth middleware to ensure only authenticated users can access.
|
*/

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Admin Dashboard
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // About Section Management
    Route::prefix('about')->name('about.')->group(function () {
        Route::get('/', [AboutProfileController::class, 'index'])->name('index');
        Route::get('/edit', [AboutProfileController::class, 'edit'])->name('edit');
        Route::post('/', [AboutProfileController::class, 'store'])->name('store');

        // Skills Management
        Route::prefix('skills')->name('skills.')->group(function () {
            Route::get('/', [SkillController::class, 'index'])->name('index');
            Route::get('/create', [SkillController::class, 'create'])->name('create');
            Route::post('/', [SkillController::class, 'store'])->name('store');
            Route::get('/{skill}/edit', [SkillController::class, 'edit'])->name('edit');
            Route::put('/{skill}', [SkillController::class, 'update'])->name('update');
            Route::delete('/{skill}', [SkillController::class, 'destroy'])->name('destroy');
            Route::post('/reorder', [SkillController::class, 'reorder'])->name('reorder');

            // Skill Categories
            Route::prefix('categories')->name('categories.')->group(function () {
                Route::get('/', [SkillCategoryController::class, 'index'])->name('index');
                Route::get('/create', [SkillCategoryController::class, 'create'])->name('create');
                Route::post('/', [SkillCategoryController::class, 'store'])->name('store');
                Route::get('/{category}/edit', [SkillCategoryController::class, 'edit'])->name('edit');
                Route::put('/{category}', [SkillCategoryController::class, 'update'])->name('update');
                Route::delete('/{category}', [SkillCategoryController::class, 'destroy'])->name('destroy');
                Route::post('/reorder', [SkillCategoryController::class, 'reorder'])->name('reorder');
            });
        });

        // Experiences Management
        Route::prefix('experiences')->name('experiences.')->group(function () {
            Route::get('/', [ExperienceController::class, 'index'])->name('index');
            Route::get('/create', [ExperienceController::class, 'create'])->name('create');
            Route::post('/', [ExperienceController::class, 'store'])->name('store');
            Route::get('/{experience}/edit', [ExperienceController::class, 'edit'])->name('edit');
            Route::put('/{experience}', [ExperienceController::class, 'update'])->name('update');
            Route::delete('/{experience}', [ExperienceController::class, 'destroy'])->name('destroy');
            Route::post('/reorder', [ExperienceController::class, 'reorder'])->name('reorder');
        });
    });

    // Placeholder routes for other sections
    Route::get('/projects', fn () => Inertia::render('admin/projects/Index'))->name('projects');
    Route::get('/blog', fn () => Inertia::render('admin/blog/Index'))->name('blog');
    Route::get('/services', fn () => Inertia::render('admin/services/Index'))->name('services');
    Route::get('/contact', fn () => Inertia::render('admin/contact/Index'))->name('contact');
});
