<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

class MakeAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:admin
                            {--name= : The name of the admin user}
                            {--email= : The email of the admin user}
                            {--password= : The password for the admin user}
                            {--force : Update existing user to admin role}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new admin user or promote an existing user to admin';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $name = $this->option('name') ?: text(
            label: 'What is the admin name?',
            placeholder: 'Admin',
            default: 'Admin',
            required: true,
        );

        $email = $this->option('email') ?: text(
            label: 'What is the admin email?',
            placeholder: 'admin@example.com',
            required: true,
            validate: fn (string $value) => match (true) {
                ! filter_var($value, FILTER_VALIDATE_EMAIL) => 'Please enter a valid email address.',
                default => null,
            },
        );

        // Check if user already exists
        $existingUser = User::where('email', $email)->first();

        if ($existingUser) {
            if ($existingUser->isAdmin()) {
                $this->components->warn("User '{$email}' is already an admin.");

                return self::SUCCESS;
            }

            if (! $this->option('force') && ! $this->confirm("User '{$email}' already exists. Promote to admin?", true)) {
                $this->components->info('Operation cancelled.');

                return self::SUCCESS;
            }

            $existingUser->update(['role' => User::ROLE_ADMIN]);
            $this->components->info("User '{$email}' has been promoted to admin.");

            return self::SUCCESS;
        }

        $password = $this->option('password') ?: password(
            label: 'Enter a password for the admin',
            required: true,
            validate: fn (string $value) => match (true) {
                strlen($value) < 8 => 'Password must be at least 8 characters.',
                default => null,
            },
        );

        // Validate input
        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ], [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->components->error($error);
            }

            return self::FAILURE;
        }

        // Create admin user
        User::create([
            'name' => $name,
            'email' => $email,
            'email_verified_at' => now(),
            'password' => Hash::make($password),
            'role' => User::ROLE_ADMIN,
        ]);

        $this->components->info("Admin user '{$email}' created successfully!");
        $this->newLine();
        $this->components->bulletList([
            "Name: {$name}",
            "Email: {$email}",
            'Role: admin',
        ]);

        return self::SUCCESS;
    }
}
