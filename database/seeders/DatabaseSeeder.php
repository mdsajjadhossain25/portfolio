<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed admin user first
        $this->call([
            AdminSeeder::class,
        ]);

        // Seed application data
        $this->call([
            AboutSeeder::class,
            ProjectTypeSeeder::class,
            ProjectSeeder::class,
        ]);
    }
}
