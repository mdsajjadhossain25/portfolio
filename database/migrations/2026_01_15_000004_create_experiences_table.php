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
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // e.g., "Junior AI Engineer"
            $table->string('company');
            $table->string('location')->nullable();
            $table->string('type')->default('full-time'); // full-time, part-time, internship, contract
            $table->date('start_date');
            $table->date('end_date')->nullable(); // Null means current position
            $table->boolean('is_current')->default(false);
            $table->text('description')->nullable();
            $table->json('highlights')->nullable(); // Array of key achievements
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
        Schema::dropIfExists('experiences');
    }
};
