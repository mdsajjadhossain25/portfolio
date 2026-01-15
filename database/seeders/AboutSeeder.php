<?php

namespace Database\Seeders;

use App\Models\AboutProfile;
use App\Models\Experience;
use App\Models\Skill;
use App\Models\SkillCategory;
use Illuminate\Database\Seeder;

class AboutSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create About Profile
        AboutProfile::create([
            'full_name' => 'Md. Sajjad Hossain',
            'title' => 'Junior AI Engineer',
            'subtitle' => 'Building intelligent systems that see, understand, and act',
            'short_bio' => 'Junior AI Engineer at Deep Mind Labs Ltd. specializing in Computer Vision and Deep Learning. Building intelligent systems that see, understand, and act on visual data.',
            'long_bio' => 'With a strong academic foundation from University of Rajshahi and hands-on experience in production AI systems, I focus on developing cutting-edge computer vision solutions. My expertise spans CNNs, LSTMs, Transformers, YOLO-based detection, U-Net segmentation, and LLM-powered RAG systems.',
            'company' => 'Deep Mind Labs Ltd.',
            'location' => 'Dhaka, Bangladesh',
            'years_of_experience' => 2,
            'university' => 'University of Rajshahi',
            'cgpa' => 3.69,
            'academic_highlight' => 'Placed 6th in department',
            'status' => 'Open to Research',
            'email' => 'contact@example.com',
            'social_links' => [
                'github' => 'https://github.com/mdsajjadhossain25',
                'linkedin' => 'https://linkedin.com/in/mdsajjadhossain25',
            ],
            'is_active' => true,
        ]);

        // Create Skill Categories
        $aiMl = SkillCategory::create([
            'name' => 'AI & Machine Learning',
            'slug' => 'ai-ml',
            'description' => 'Core AI/ML frameworks and tools',
            'icon' => '🤖',
            'color' => 'cyan',
            'display_order' => 1,
        ]);

        $cv = SkillCategory::create([
            'name' => 'Computer Vision',
            'slug' => 'computer-vision',
            'description' => 'Image processing and visual AI',
            'icon' => '👁️',
            'color' => 'purple',
            'display_order' => 2,
        ]);

        $llm = SkillCategory::create([
            'name' => 'LLMs & NLP',
            'slug' => 'llms-nlp',
            'description' => 'Large language models and natural language processing',
            'icon' => '🧠',
            'color' => 'green',
            'display_order' => 3,
        ]);

        $backend = SkillCategory::create([
            'name' => 'Backend & Tools',
            'slug' => 'backend-tools',
            'description' => 'Development tools and backend technologies',
            'icon' => '⚙️',
            'color' => 'crimson',
            'display_order' => 4,
        ]);

        // AI & ML Skills
        $aiMlSkills = [
            ['name' => 'PyTorch', 'icon' => '🔥', 'is_featured' => true],
            ['name' => 'TensorFlow', 'icon' => '📊', 'is_featured' => true],
            ['name' => 'Keras', 'icon' => '🎯'],
            ['name' => 'NumPy', 'icon' => '🔢'],
            ['name' => 'Pandas', 'icon' => '🐼'],
            ['name' => 'Scikit-learn', 'icon' => '📈'],
            ['name' => 'CNNs', 'icon' => '🖼️', 'tag' => 'Architecture'],
            ['name' => 'LSTMs', 'icon' => '🔄', 'tag' => 'Architecture'],
            ['name' => 'Transformers', 'icon' => '🤖', 'tag' => 'Architecture', 'is_featured' => true],
        ];

        foreach ($aiMlSkills as $index => $skill) {
            Skill::create([
                'skill_category_id' => $aiMl->id,
                'name' => $skill['name'],
                'icon' => $skill['icon'] ?? null,
                'tag' => $skill['tag'] ?? null,
                'is_featured' => $skill['is_featured'] ?? false,
                'display_order' => $index + 1,
            ]);
        }

        // Computer Vision Skills
        $cvSkills = [
            ['name' => 'OpenCV', 'icon' => '📷', 'is_featured' => true],
            ['name' => 'PIL/Pillow', 'icon' => '🖼️'],
            ['name' => 'YOLO', 'icon' => '🎯', 'tag' => 'Detection', 'is_featured' => true],
            ['name' => 'Faster R-CNN', 'icon' => '🔍', 'tag' => 'Detection'],
            ['name' => 'U-Net', 'icon' => '🎨', 'tag' => 'Segmentation'],
            ['name' => 'ResNet', 'icon' => '📊', 'tag' => 'Classification'],
            ['name' => 'VGG', 'icon' => '📊', 'tag' => 'Classification'],
            ['name' => 'Image Augmentation', 'icon' => '🔄'],
        ];

        foreach ($cvSkills as $index => $skill) {
            Skill::create([
                'skill_category_id' => $cv->id,
                'name' => $skill['name'],
                'icon' => $skill['icon'] ?? null,
                'tag' => $skill['tag'] ?? null,
                'is_featured' => $skill['is_featured'] ?? false,
                'display_order' => $index + 1,
            ]);
        }

        // LLM Skills
        $llmSkills = [
            ['name' => 'LangChain', 'icon' => '🔗', 'is_featured' => true],
            ['name' => 'RAG Systems', 'icon' => '📚', 'is_featured' => true],
            ['name' => 'GPT APIs', 'icon' => '💬'],
            ['name' => 'Hugging Face', 'icon' => '🤗'],
            ['name' => 'Prompt Engineering', 'icon' => '✍️'],
            ['name' => 'Embeddings', 'icon' => '🔢'],
            ['name' => 'Vector Databases', 'icon' => '🗄️'],
        ];

        foreach ($llmSkills as $index => $skill) {
            Skill::create([
                'skill_category_id' => $llm->id,
                'name' => $skill['name'],
                'icon' => $skill['icon'] ?? null,
                'tag' => $skill['tag'] ?? null,
                'is_featured' => $skill['is_featured'] ?? false,
                'display_order' => $index + 1,
            ]);
        }

        // Backend Skills
        $backendSkills = [
            ['name' => 'Python', 'icon' => '🐍', 'is_featured' => true],
            ['name' => 'FastAPI', 'icon' => '⚡'],
            ['name' => 'Flask', 'icon' => '🌶️'],
            ['name' => 'Docker', 'icon' => '🐳'],
            ['name' => 'Git', 'icon' => '📦'],
            ['name' => 'Linux', 'icon' => '🐧'],
            ['name' => 'REST APIs', 'icon' => '🔌'],
            ['name' => 'PostgreSQL', 'icon' => '🐘'],
        ];

        foreach ($backendSkills as $index => $skill) {
            Skill::create([
                'skill_category_id' => $backend->id,
                'name' => $skill['name'],
                'icon' => $skill['icon'] ?? null,
                'tag' => $skill['tag'] ?? null,
                'is_featured' => $skill['is_featured'] ?? false,
                'display_order' => $index + 1,
            ]);
        }

        // Create Experiences
        Experience::create([
            'title' => 'Junior AI Engineer',
            'company' => 'Deep Mind Labs Ltd.',
            'location' => 'Dhaka, Bangladesh',
            'type' => 'full-time',
            'start_date' => '2024-01-01',
            'is_current' => true,
            'description' => 'Building production CV systems, HAR models, and LLM-powered applications.',
            'highlights' => [
                'Developed YOLO-based object detection pipeline',
                'Built RAG system for document QA',
                'Optimized model inference by 40%',
            ],
            'display_order' => 1,
        ]);

        Experience::create([
            'title' => 'AI Research Intern',
            'company' => 'Research Lab',
            'location' => 'Remote',
            'type' => 'internship',
            'start_date' => '2023-06-01',
            'end_date' => '2023-12-31',
            'is_current' => false,
            'description' => 'Developed CNN+LSTM models for human activity recognition. Published research.',
            'display_order' => 2,
        ]);

        Experience::create([
            'title' => 'ML Project Lead',
            'company' => 'University of Rajshahi',
            'location' => 'Rajshahi, Bangladesh',
            'type' => 'part-time',
            'start_date' => '2022-01-01',
            'end_date' => '2023-05-31',
            'is_current' => false,
            'description' => 'Led computer vision research projects. Ranked 6th in department (CGPA: 3.69/4.0).',
            'display_order' => 3,
        ]);
    }
}
