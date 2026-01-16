<?php

use App\Http\Controllers\Admin\AboutProfileController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\BlogCategoryController;
use App\Http\Controllers\Admin\BlogCommentController;
use App\Http\Controllers\Admin\BlogPostController;
use App\Http\Controllers\Admin\BlogTagController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ProjectTypeController;
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

    // Projects Management
    Route::prefix('projects')->name('projects.')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::get('/create', [ProjectController::class, 'create'])->name('create');
        Route::post('/', [ProjectController::class, 'store'])->name('store');
        Route::get('/{project}/edit', [ProjectController::class, 'edit'])->name('edit');
        Route::put('/{project}', [ProjectController::class, 'update'])->name('update');
        Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('destroy');
        Route::post('/{project}/toggle-featured', [ProjectController::class, 'toggleFeatured'])->name('toggle-featured');
        Route::post('/{project}/toggle-active', [ProjectController::class, 'toggleActive'])->name('toggle-active');
        Route::post('/reorder', [ProjectController::class, 'reorder'])->name('reorder');
        Route::delete('/{project}/images/{image}', [ProjectController::class, 'deleteImage'])->name('delete-image');
    });

    // Project Types Management
    Route::prefix('project-types')->name('project-types.')->group(function () {
        Route::get('/', [ProjectTypeController::class, 'index'])->name('index');
        Route::get('/create', [ProjectTypeController::class, 'create'])->name('create');
        Route::post('/', [ProjectTypeController::class, 'store'])->name('store');
        Route::get('/{project_type}/edit', [ProjectTypeController::class, 'edit'])->name('edit');
        Route::put('/{project_type}', [ProjectTypeController::class, 'update'])->name('update');
        Route::delete('/{project_type}', [ProjectTypeController::class, 'destroy'])->name('destroy');
        Route::post('/{project_type}/toggle-active', [ProjectTypeController::class, 'toggleActive'])->name('toggle-active');
        Route::post('/reorder', [ProjectTypeController::class, 'reorder'])->name('reorder');
    });

    // Blog Management
    Route::prefix('blog')->name('blog.')->group(function () {
        // Blog Posts
        Route::prefix('posts')->name('posts.')->group(function () {
            Route::get('/', [BlogPostController::class, 'index'])->name('index');
            Route::get('/create', [BlogPostController::class, 'create'])->name('create');
            Route::post('/', [BlogPostController::class, 'store'])->name('store');
            Route::get('/{post}/edit', [BlogPostController::class, 'edit'])->name('edit');
            Route::put('/{post}', [BlogPostController::class, 'update'])->name('update');
            Route::delete('/{post}', [BlogPostController::class, 'destroy'])->name('destroy');
            Route::post('/{post}/toggle-featured', [BlogPostController::class, 'toggleFeatured'])->name('toggle-featured');
            Route::post('/{post}/toggle-publish', [BlogPostController::class, 'togglePublish'])->name('toggle-publish');
            Route::get('/{post}/preview', [BlogPostController::class, 'preview'])->name('preview');
        });

        // Blog Categories
        Route::prefix('categories')->name('categories.')->group(function () {
            Route::get('/', [BlogCategoryController::class, 'index'])->name('index');
            Route::get('/create', [BlogCategoryController::class, 'create'])->name('create');
            Route::post('/', [BlogCategoryController::class, 'store'])->name('store');
            Route::get('/{category}/edit', [BlogCategoryController::class, 'edit'])->name('edit');
            Route::put('/{category}', [BlogCategoryController::class, 'update'])->name('update');
            Route::delete('/{category}', [BlogCategoryController::class, 'destroy'])->name('destroy');
            Route::post('/reorder', [BlogCategoryController::class, 'reorder'])->name('reorder');
        });

        // Blog Tags
        Route::prefix('tags')->name('tags.')->group(function () {
            Route::get('/', [BlogTagController::class, 'index'])->name('index');
            Route::get('/create', [BlogTagController::class, 'create'])->name('create');
            Route::post('/', [BlogTagController::class, 'store'])->name('store');
            Route::get('/{tag}/edit', [BlogTagController::class, 'edit'])->name('edit');
            Route::put('/{tag}', [BlogTagController::class, 'update'])->name('update');
            Route::delete('/{tag}', [BlogTagController::class, 'destroy'])->name('destroy');
        });

        // Blog Comments
        Route::prefix('comments')->name('comments.')->group(function () {
            Route::get('/', [BlogCommentController::class, 'index'])->name('index');
            Route::post('/{comment}/approve', [BlogCommentController::class, 'approve'])->name('approve');
            Route::post('/{comment}/unapprove', [BlogCommentController::class, 'unapprove'])->name('unapprove');
            Route::post('/{comment}/toggle-approval', [BlogCommentController::class, 'toggleApproval'])->name('toggle-approval');
            Route::delete('/{comment}', [BlogCommentController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [BlogCommentController::class, 'bulkDestroy'])->name('bulk-destroy');
            Route::post('/bulk-approve', [BlogCommentController::class, 'bulkApprove'])->name('bulk-approve');
        });
    });

    // Placeholder routes for other sections
    Route::get('/services', fn () => Inertia::render('admin/services/Index'))->name('services');
    Route::get('/contact', fn () => Inertia::render('admin/contact/Index'))->name('contact');
});
