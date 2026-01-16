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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('short_description');
            $table->text('detailed_description')->nullable();
            $table->enum('service_type', ['consulting', 'development', 'research', 'freelance', 'hiring'])->default('consulting');
            $table->enum('pricing_model', ['hourly', 'project', 'retainer', 'custom'])->default('custom');
            $table->string('price_label')->nullable(); // e.g. "$50/hr", "Starting at $1,500", "Custom"
            $table->string('duration')->nullable(); // e.g. "2-4 weeks", "Ongoing"
            $table->string('icon')->nullable(); // Icon name for display
            $table->boolean('is_featured')->default(false);
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
        Schema::dropIfExists('services');
    }
};
