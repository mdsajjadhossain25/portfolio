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
        Schema::create('skill_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "AI & ML", "Computer Vision", "Backend"
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->string('icon')->nullable(); // Emoji or icon class
            $table->string('color')->default('cyan'); // cyan, purple, green, crimson
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
        Schema::dropIfExists('skill_categories');
    }
};
