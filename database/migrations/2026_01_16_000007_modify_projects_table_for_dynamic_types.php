<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, we need to create a temporary column to store the old values
        Schema::table('projects', function (Blueprint $table) {
            $table->string('project_type_temp')->nullable()->after('project_type');
        });

        // Copy old enum values to temp column
        DB::table('projects')->update(['project_type_temp' => DB::raw('project_type')]);

        // Drop the old enum column
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('project_type');
        });

        // Add the new foreign key column
        Schema::table('projects', function (Blueprint $table) {
            $table->foreignId('project_type_id')
                ->nullable()
                ->after('detailed_description')
                ->constrained('project_types')
                ->nullOnDelete();
        });

        // Drop the temp column (we'll handle data migration in seeder)
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('project_type_temp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['project_type_id']);
            $table->dropColumn('project_type_id');
            $table->enum('project_type', ['ai', 'computer_vision', 'llm', 'full_stack', 'research'])
                ->default('ai')
                ->after('detailed_description');
        });
    }
};
