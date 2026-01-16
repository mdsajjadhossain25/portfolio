<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Seed the admin user.
     *
     * Admin credentials can be configured via environment variables:
     * - ADMIN_NAME (default: 'Admin')
     * - ADMIN_EMAIL (default: 'admin@example.com')
     * - ADMIN_PASSWORD (default: 'password')
     */
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'admin@example.com');

        // Check if admin already exists
        $existingAdmin = User::where('email', $adminEmail)->first();

        if ($existingAdmin) {
            // Update existing user to admin if not already
            if (! $existingAdmin->isAdmin()) {
                $existingAdmin->update(['role' => User::ROLE_ADMIN]);
                $this->command->info("Updated existing user '{$adminEmail}' to admin role.");
            } else {
                $this->command->info("Admin user '{$adminEmail}' already exists.");
            }

            return;
        }

        // Create new admin user
        User::create([
            'name' => env('ADMIN_NAME', 'Admin'),
            'email' => $adminEmail,
            'email_verified_at' => now(),
            'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
            'role' => User::ROLE_ADMIN,
        ]);

        $this->command->info("Admin user '{$adminEmail}' created successfully.");
    }
}
