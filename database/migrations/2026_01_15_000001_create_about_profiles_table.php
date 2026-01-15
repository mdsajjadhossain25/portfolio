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
        Schema::create('about_profiles', function (Blueprint $table) {
            $table->id();
            
            // Basic info
            $table->string('full_name');
            $table->string('title'); // e.g., "Junior AI Engineer"
            $table->string('subtitle')->nullable(); // Tagline
            $table->text('short_bio'); // Brief introduction
            $table->text('long_bio')->nullable(); // Detailed biography
            
            // Profile image
            $table->string('profile_image')->nullable();
            
            // Professional info
            $table->string('company')->nullable();
            $table->string('location')->nullable();
            $table->integer('years_of_experience')->nullable();
            
            // Academic info
            $table->string('university')->nullable();
            $table->decimal('cgpa', 3, 2)->nullable();
            $table->string('academic_highlight')->nullable(); // e.g., "Placed 6th in department"
            
            // Contact & Links
            $table->string('resume_url')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            
            // Social links (JSON for flexibility)
            $table->json('social_links')->nullable();
            
            // Status
            $table->string('status')->default('Open to Opportunities');
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about_profiles');
    }
};
