<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectType;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get project type IDs
        $types = ProjectType::pluck('id', 'slug')->toArray();

        $projects = [
            [
                'title' => 'Human Activity Recognition System',
                'slug' => 'human-activity-recognition',
                'short_description' => 'CNN+LSTM architecture for video-based activity classification. Achieved 94.2% accuracy on UCF-101 dataset with real-time inference.',
                'detailed_description' => "A comprehensive deep learning system for recognizing human activities from video streams.\n\nThis project implements a hybrid CNN+LSTM architecture that:\n- Uses ResNet-50 for spatial feature extraction\n- Employs 2-layer LSTM for temporal modeling\n- Supports real-time inference at 30 FPS\n- Trained on UCF-101 and Kinetics-400 datasets\n\nThe system is optimized for edge deployment using TensorRT and can run on NVIDIA Jetson devices.",
                'project_type_id' => $types['computer-vision'] ?? null,
                'tech_stack' => ['PyTorch', 'CNN', 'LSTM', 'OpenCV', 'TensorRT', 'CUDA'],
                'tags' => ['Deep Learning', 'Video Analysis', 'Real-time'],
                'github_url' => 'https://github.com/example/har-system',
                'dataset_used' => 'UCF-101, Kinetics-400',
                'role' => 'Lead Developer',
                'is_featured' => true,
                'status' => 'completed',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'YOLO-based Object Detection Pipeline',
                'slug' => 'yolo-object-detection',
                'short_description' => 'Custom-trained YOLOv8 model for industrial defect detection. Deployed on edge devices with TensorRT optimization.',
                'detailed_description' => "An end-to-end object detection system designed for manufacturing quality control.\n\nKey achievements:\n- Custom YOLOv8 model trained on 50,000+ annotated images\n- 98.5% detection accuracy on production line defects\n- Reduced false positive rate by 67% compared to previous solution\n- Edge deployment with 45 FPS on NVIDIA Jetson AGX\n\nThe pipeline includes data augmentation, active learning, and continuous model improvement.",
                'project_type_id' => $types['computer-vision'] ?? null,
                'tech_stack' => ['YOLOv8', 'TensorRT', 'OpenCV', 'Python', 'Docker', 'Kubernetes'],
                'tags' => ['Object Detection', 'Edge AI', 'Manufacturing'],
                'github_url' => 'https://github.com/example/yolo-defect',
                'live_url' => 'https://demo.example.com/yolo',
                'dataset_used' => 'Custom Industrial Dataset',
                'role' => 'Lead ML Engineer',
                'is_featured' => true,
                'status' => 'completed',
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'RAG-powered Document QA System',
                'slug' => 'rag-document-qa',
                'short_description' => 'LangChain-based retrieval system with GPT-4 for enterprise document search. Vector embeddings with ChromaDB.',
                'detailed_description' => "A production-ready Retrieval Augmented Generation (RAG) system for enterprise knowledge management.\n\nFeatures:\n- Hybrid search combining semantic and keyword matching\n- Multi-modal support for PDFs, Word docs, and web pages\n- Conversation memory for contextual follow-up questions\n- Custom fine-tuned embeddings for domain-specific terminology\n- Integration with existing SSO and access control systems\n\nThe system processes over 100,000 documents and serves 500+ daily active users.",
                'project_type_id' => $types['llm'] ?? null,
                'tech_stack' => ['LangChain', 'OpenAI GPT-4', 'ChromaDB', 'FastAPI', 'React', 'PostgreSQL'],
                'tags' => ['RAG', 'NLP', 'Enterprise AI'],
                'github_url' => 'https://github.com/example/rag-qa',
                'dataset_used' => 'Enterprise Document Corpus',
                'role' => 'AI Architect',
                'is_featured' => true,
                'status' => 'completed',
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Medical Image Segmentation',
                'slug' => 'medical-image-segmentation',
                'short_description' => 'U-Net architecture for tumor segmentation in MRI scans. Dice coefficient of 0.89 on BraTS dataset.',
                'detailed_description' => "Deep learning system for automated brain tumor segmentation from MRI images.\n\nTechnical details:\n- Modified U-Net with attention gates and residual connections\n- Multi-scale feature extraction for improved boundary detection\n- Data augmentation strategies for limited medical datasets\n- Uncertainty quantification for clinical decision support\n\nValidated on BraTS 2021 challenge dataset with competitive results.",
                'project_type_id' => $types['research'] ?? null,
                'tech_stack' => ['TensorFlow', 'U-Net', 'Medical Imaging', 'MONAI', 'Python'],
                'tags' => ['Medical AI', 'Segmentation', 'Healthcare'],
                'paper_url' => 'https://arxiv.org/example/medical-seg',
                'dataset_used' => 'BraTS 2021',
                'role' => 'Researcher',
                'is_featured' => false,
                'status' => 'completed',
                'display_order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'AI-Powered Web Analytics Platform',
                'slug' => 'ai-web-analytics',
                'short_description' => 'Django + React platform with integrated anomaly detection for user behavior analysis using Isolation Forest.',
                'detailed_description' => "Full-stack web analytics platform with AI-powered insights.\n\nCapabilities:\n- Real-time user tracking and session analysis\n- Automated anomaly detection for unusual traffic patterns\n- Predictive analytics for user churn and conversion\n- Custom dashboards with interactive visualizations\n- REST API for third-party integrations\n\nBuilt with scalability in mind, handling 10M+ events per day.",
                'project_type_id' => $types['full-stack'] ?? null,
                'tech_stack' => ['Django', 'React', 'PostgreSQL', 'Redis', 'Scikit-learn', 'Docker'],
                'tags' => ['Full-Stack', 'Analytics', 'Anomaly Detection'],
                'github_url' => 'https://github.com/example/ai-analytics',
                'live_url' => 'https://analytics.example.com',
                'role' => 'Full-Stack Developer',
                'is_featured' => false,
                'status' => 'completed',
                'display_order' => 5,
                'is_active' => true,
            ],
            [
                'title' => 'Conversational AI Assistant',
                'slug' => 'conversational-ai-assistant',
                'short_description' => 'Multi-turn conversational AI using fine-tuned LLM with custom tool integration and memory management.',
                'detailed_description' => "An advanced conversational AI system designed for customer support automation.\n\nHighlights:\n- Fine-tuned LLaMA model for domain-specific conversations\n- Function calling for database queries and API integrations\n- Long-term memory for persistent user context\n- Multi-language support with automatic language detection\n- Sentiment analysis for escalation triggers\n\nCurrently deployed serving 1000+ conversations daily with 95% customer satisfaction.",
                'project_type_id' => $types['llm'] ?? null,
                'tech_stack' => ['LLaMA', 'LangChain', 'FastAPI', 'PostgreSQL', 'Redis', 'React'],
                'tags' => ['Conversational AI', 'LLM', 'Customer Support'],
                'dataset_used' => 'Custom Support Ticket Dataset',
                'role' => 'AI Lead',
                'is_featured' => false,
                'status' => 'ongoing',
                'display_order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($projects as $projectData) {
            $project = Project::create($projectData);

            // Add sample features for first project
            if ($project->slug === 'human-activity-recognition') {
                $project->features()->createMany([
                    ['title' => 'Real-time Processing', 'description' => 'Process video streams at 30 FPS', 'icon' => '⚡', 'display_order' => 1],
                    ['title' => 'Multi-camera Support', 'description' => 'Handle multiple video feeds simultaneously', 'icon' => '📹', 'display_order' => 2],
                    ['title' => 'Edge Deployment', 'description' => 'Optimized for NVIDIA Jetson devices', 'icon' => '🔧', 'display_order' => 3],
                    ['title' => 'Action Recognition', 'description' => 'Recognize 101 different human activities', 'icon' => '🎯', 'display_order' => 4],
                ]);

                $project->metrics()->createMany([
                    ['name' => 'Accuracy', 'value' => '94.2%', 'description' => 'UCF-101 dataset', 'display_order' => 1],
                    ['name' => 'FPS', 'value' => '30', 'description' => 'Real-time inference', 'display_order' => 2],
                    ['name' => 'Latency', 'value' => '33ms', 'description' => 'End-to-end', 'display_order' => 3],
                ]);
            }

            // Add sample features for YOLO project
            if ($project->slug === 'yolo-object-detection') {
                $project->features()->createMany([
                    ['title' => 'Custom Training', 'description' => 'Train on domain-specific datasets', 'icon' => '🎓', 'display_order' => 1],
                    ['title' => 'TensorRT Optimization', 'description' => '2x speedup with TensorRT', 'icon' => '🚀', 'display_order' => 2],
                    ['title' => 'API Integration', 'description' => 'REST API for easy integration', 'icon' => '🔌', 'display_order' => 3],
                ]);

                $project->metrics()->createMany([
                    ['name' => 'mAP@0.5', 'value' => '98.5%', 'description' => 'Mean Average Precision', 'display_order' => 1],
                    ['name' => 'FPS', 'value' => '45', 'description' => 'Jetson AGX Xavier', 'display_order' => 2],
                    ['name' => 'False Positives', 'value' => '-67%', 'description' => 'Reduction vs baseline', 'display_order' => 3],
                ]);
            }

            // Add sample features for RAG project
            if ($project->slug === 'rag-document-qa') {
                $project->features()->createMany([
                    ['title' => 'Hybrid Search', 'description' => 'Semantic + keyword matching', 'icon' => '🔍', 'display_order' => 1],
                    ['title' => 'Multi-modal', 'description' => 'PDFs, docs, and web pages', 'icon' => '📄', 'display_order' => 2],
                    ['title' => 'Memory', 'description' => 'Conversation context retention', 'icon' => '🧠', 'display_order' => 3],
                    ['title' => 'Enterprise SSO', 'description' => 'Integrated access control', 'icon' => '🔐', 'display_order' => 4],
                ]);

                $project->metrics()->createMany([
                    ['name' => 'Documents', 'value' => '100K+', 'description' => 'Indexed documents', 'display_order' => 1],
                    ['name' => 'DAU', 'value' => '500+', 'description' => 'Daily active users', 'display_order' => 2],
                    ['name' => 'Response Time', 'value' => '<2s', 'description' => 'Average query latency', 'display_order' => 3],
                ]);
            }
        }
    }
}
