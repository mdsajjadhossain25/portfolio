<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'Computer Vision Solutions',
                'slug' => 'computer-vision-solutions',
                'short_description' => 'Custom CV systems for object detection, image segmentation, facial recognition, and visual inspection pipelines.',
                'detailed_description' => 'I develop production-ready computer vision solutions using state-of-the-art deep learning models. From YOLOv8 object detection to custom image segmentation pipelines, I can help you build systems that see and understand visual data.',
                'service_type' => 'development',
                'pricing_model' => 'project',
                'price_label' => 'Starting at $3,000',
                'duration' => '2-4 weeks',
                'icon' => 'search',
                'is_featured' => true,
                'display_order' => 1,
                'is_active' => true,
                'features' => [
                    'Object Detection (YOLO, Faster R-CNN)',
                    'Image Segmentation (U-Net, Mask R-CNN)',
                    'Face Recognition & Verification',
                    'OCR & Document Processing',
                    'Edge Deployment Optimization',
                ],
            ],
            [
                'title' => 'LLM & RAG Systems',
                'slug' => 'llm-rag-systems',
                'short_description' => 'AI-powered applications using large language models. RAG pipelines, chatbots, and intelligent document processing.',
                'detailed_description' => 'Leverage the power of GPT-4, Claude, and open-source LLMs with custom RAG architectures. I build intelligent systems that understand your documents and provide accurate, contextual responses.',
                'service_type' => 'development',
                'pricing_model' => 'project',
                'price_label' => 'Starting at $4,000',
                'duration' => '3-6 weeks',
                'icon' => 'brain',
                'is_featured' => true,
                'display_order' => 2,
                'is_active' => true,
                'features' => [
                    'RAG Architecture Design',
                    'LangChain Integration',
                    'Custom Prompt Engineering',
                    'Vector Database Setup',
                    'API Integration & Deployment',
                ],
            ],
            [
                'title' => 'AI Consulting & Prototyping',
                'slug' => 'ai-consulting',
                'short_description' => 'Technical guidance on ML/AI strategy. Rapid prototyping to validate ideas before full development.',
                'detailed_description' => 'Not sure if AI is right for your use case? I provide technical consulting to help you understand the feasibility, requirements, and expected outcomes of AI projects.',
                'service_type' => 'consulting',
                'pricing_model' => 'hourly',
                'price_label' => '$150/hour',
                'duration' => 'Flexible',
                'icon' => 'briefcase',
                'is_featured' => true,
                'display_order' => 3,
                'is_active' => true,
                'features' => [
                    'Feasibility Analysis',
                    'Model Architecture Review',
                    'Dataset Strategy',
                    'Proof-of-Concept Development',
                    'Performance Benchmarking',
                ],
            ],
            [
                'title' => 'ML Research & Development',
                'slug' => 'ml-research',
                'short_description' => 'Custom research for novel ML problems. Academic-level rigor with production-focused outcomes.',
                'detailed_description' => 'For complex ML challenges that require custom solutions beyond off-the-shelf models. I conduct research, experiment with architectures, and develop novel approaches tailored to your specific needs.',
                'service_type' => 'research',
                'pricing_model' => 'retainer',
                'price_label' => 'Custom Quote',
                'duration' => 'Ongoing',
                'icon' => 'search',
                'is_featured' => false,
                'display_order' => 4,
                'is_active' => true,
                'features' => [
                    'Literature Review',
                    'Custom Model Development',
                    'Benchmark Creation',
                    'Research Documentation',
                    'Publication Assistance',
                ],
            ],
            [
                'title' => 'Freelance AI Development',
                'slug' => 'freelance-development',
                'short_description' => 'Flexible freelance engagement for ongoing AI projects and maintenance.',
                'detailed_description' => 'Need a dedicated AI developer for your project? I offer flexible freelance arrangements for companies that need ongoing AI development support.',
                'service_type' => 'freelance',
                'pricing_model' => 'retainer',
                'price_label' => 'Starting at $5,000/mo',
                'duration' => 'Monthly',
                'icon' => 'code',
                'is_featured' => false,
                'display_order' => 5,
                'is_active' => true,
                'features' => [
                    'Dedicated Development Time',
                    'Flexible Scope',
                    'Regular Check-ins',
                    'Priority Support',
                    'Code Ownership',
                ],
            ],
        ];

        foreach ($services as $serviceData) {
            $features = $serviceData['features'];
            unset($serviceData['features']);

            $service = Service::create($serviceData);

            foreach ($features as $index => $featureText) {
                $service->features()->create([
                    'feature_text' => $featureText,
                    'display_order' => $index,
                ]);
            }
        }
    }
}
