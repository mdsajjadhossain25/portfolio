<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('short_description', 500);
            $table->text('detailed_description')->nullable();
            $table->enum('project_type', ['ai', 'computer_vision', 'llm', 'full_stack', 'research'])->default('ai');
            $table->json('tech_stack')->nullable();
            $table->json('tags')->nullable();
            $table->string('thumbnail_image')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('github_url')->nullable();
            $table->string('live_url')->nullable();
            $table->string('paper_url')->nullable();
            $table->string('dataset_used')->nullable();
            $table->string('role')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['completed', 'ongoing'])->default('completed');
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
