<?php

namespace Database\Seeders;

use App\Models\ProjectType;
use Illuminate\Database\Seeder;

class ProjectTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'AI',
                'slug' => 'ai',
                'color' => 'cyan',
                'icon' => 'brain',
                'description' => 'Artificial Intelligence and Machine Learning projects',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Computer Vision',
                'slug' => 'computer-vision',
                'color' => 'purple',
                'icon' => 'eye',
                'description' => 'Image processing, object detection, and visual recognition projects',
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'LLM',
                'slug' => 'llm',
                'color' => 'green',
                'icon' => 'message-square',
                'description' => 'Large Language Models and NLP projects',
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Full-Stack',
                'slug' => 'full-stack',
                'color' => 'blue',
                'icon' => 'layers',
                'description' => 'Full-stack web applications',
                'display_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Research',
                'slug' => 'research',
                'color' => 'crimson',
                'icon' => 'flask',
                'description' => 'Academic and experimental research projects',
                'display_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($types as $type) {
            ProjectType::updateOrCreate(
                ['slug' => $type['slug']],
                $type
            );
        }
    }
}
