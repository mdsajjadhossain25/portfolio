<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogTag;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Categories
        $categories = [
            [
                'name' => 'Artificial Intelligence',
                'slug' => 'artificial-intelligence',
                'description' => 'Articles about AI, machine learning, and deep learning research.',
            ],
            [
                'name' => 'Software Engineering',
                'slug' => 'software-engineering',
                'description' => 'Best practices, design patterns, and software development insights.',
            ],
            [
                'name' => 'Tutorials',
                'slug' => 'tutorials',
                'description' => 'Step-by-step guides and how-to articles.',
            ],
            [
                'name' => 'Research',
                'slug' => 'research',
                'description' => 'Academic research summaries and findings.',
            ],
        ];

        foreach ($categories as $category) {
            BlogCategory::create($category);
        }

        // Create Tags
        $tags = [
            ['name' => 'Python', 'slug' => 'python'],
            ['name' => 'Machine Learning', 'slug' => 'machine-learning'],
            ['name' => 'Deep Learning', 'slug' => 'deep-learning'],
            ['name' => 'PyTorch', 'slug' => 'pytorch'],
            ['name' => 'TensorFlow', 'slug' => 'tensorflow'],
            ['name' => 'NLP', 'slug' => 'nlp'],
            ['name' => 'Computer Vision', 'slug' => 'computer-vision'],
            ['name' => 'Laravel', 'slug' => 'laravel'],
            ['name' => 'React', 'slug' => 'react'],
            ['name' => 'TypeScript', 'slug' => 'typescript'],
        ];

        foreach ($tags as $tag) {
            BlogTag::create($tag);
        }

        // Create Sample Posts
        $posts = [
            [
                'title' => 'Building Neural Networks from Scratch with Python',
                'slug' => 'building-neural-networks-from-scratch',
                'excerpt' => 'Learn how to implement a neural network without any deep learning frameworks, understanding every step of forward and backward propagation.',
                'content' => "# Building Neural Networks from Scratch

In this comprehensive tutorial, we'll build a neural network from the ground up using only NumPy. This hands-on approach will give you a deep understanding of how neural networks actually work.

## Why Build from Scratch?

Understanding the internals of neural networks is crucial for:
- **Debugging** complex models
- **Optimizing** performance
- **Customizing** architectures for specific problems

## The Mathematics Behind It

### Forward Propagation

Forward propagation is the process of calculating the output of the network given an input:

```python
def forward(self, X):
    self.z1 = np.dot(X, self.W1) + self.b1
    self.a1 = self.relu(self.z1)
    self.z2 = np.dot(self.a1, self.W2) + self.b2
    self.a2 = self.softmax(self.z2)
    return self.a2
```

### Backward Propagation

Backpropagation computes gradients using the chain rule:

```python
def backward(self, X, y, output):
    m = X.shape[0]
    dz2 = output - y
    dW2 = (1/m) * np.dot(self.a1.T, dz2)
    db2 = (1/m) * np.sum(dz2, axis=0)
    # ... continue for all layers
```

## Complete Implementation

Check out the full implementation in my GitHub repository linked below.

## Conclusion

Building neural networks from scratch is an invaluable learning experience that will make you a better ML engineer.",
                'author_name' => 'Sajjad Aghapour',
                'status' => 'published',
                'is_featured' => true,
                'published_at' => now()->subDays(3),
                'categories' => ['artificial-intelligence', 'tutorials'],
                'tags' => ['python', 'machine-learning', 'deep-learning'],
            ],
            [
                'title' => 'Getting Started with Transformers for NLP',
                'slug' => 'getting-started-with-transformers-nlp',
                'excerpt' => 'A beginner-friendly introduction to transformer architecture and how to use HuggingFace for NLP tasks.',
                'content' => "# Getting Started with Transformers for NLP

Transformers have revolutionized Natural Language Processing. This guide will help you understand and implement them.

## What are Transformers?

Transformers are neural network architectures that use self-attention mechanisms to process sequential data. Unlike RNNs, they can process all positions in parallel.

## Key Components

### Self-Attention

The attention mechanism allows the model to focus on different parts of the input when producing each part of the output.

### Multi-Head Attention

Using multiple attention heads allows the model to jointly attend to information from different representation subspaces.

## Using HuggingFace

```python
from transformers import pipeline

classifier = pipeline('sentiment-analysis')
result = classifier('I love learning about AI!')
print(result)
```

## Conclusion

Transformers are powerful but approachable with the right tools.",
                'author_name' => 'Sajjad Aghapour',
                'status' => 'published',
                'is_featured' => false,
                'published_at' => now()->subDays(7),
                'categories' => ['artificial-intelligence', 'tutorials'],
                'tags' => ['python', 'nlp', 'deep-learning'],
            ],
            [
                'title' => 'Clean Architecture in Laravel Applications',
                'slug' => 'clean-architecture-laravel-applications',
                'excerpt' => 'How to structure large Laravel applications using clean architecture principles for maintainability and testability.',
                'content' => "# Clean Architecture in Laravel Applications

Learn how to apply Uncle Bob's Clean Architecture principles to your Laravel projects.

## Why Clean Architecture?

- **Separation of Concerns**: Business logic is isolated from frameworks
- **Testability**: Easy to unit test without database or HTTP
- **Flexibility**: Easy to swap implementations

## Layer Structure

### Domain Layer
Contains business entities and interfaces.

### Application Layer
Contains use cases and application-specific business rules.

### Infrastructure Layer
Contains framework-specific implementations.

## Example Implementation

```php
// Domain/Entities/User.php
class User
{
    public function __construct(
        public readonly string \$name,
        public readonly Email \$email,
    ) {}
}

// Application/UseCases/CreateUser.php
class CreateUser
{
    public function execute(CreateUserRequest \$request): User
    {
        // Business logic here
    }
}
```

## Conclusion

Clean Architecture takes more initial setup but pays off in large applications.",
                'author_name' => 'Sajjad Aghapour',
                'status' => 'published',
                'is_featured' => false,
                'published_at' => now()->subDays(14),
                'categories' => ['software-engineering'],
                'tags' => ['laravel'],
            ],
            [
                'title' => 'Building Modern UIs with React and TypeScript',
                'slug' => 'building-modern-uis-react-typescript',
                'excerpt' => 'Type-safe React development patterns and best practices for building scalable frontend applications.',
                'content' => "# Building Modern UIs with React and TypeScript

TypeScript makes React development more robust and maintainable.

## Why TypeScript?

- Catch errors at compile time
- Better IDE support
- Self-documenting code

## Component Patterns

### Typed Props

```typescript
interface ButtonProps {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
    return <button className={variant} onClick={onClick}>{label}</button>;
};
```

### Custom Hooks

```typescript
function useApi<T>(url: string): { data: T | null; loading: boolean; error: Error | null } {
    // Implementation
}
```

## Conclusion

TypeScript is essential for professional React development.",
                'author_name' => 'Sajjad Aghapour',
                'status' => 'published',
                'is_featured' => false,
                'published_at' => now()->subDays(21),
                'categories' => ['software-engineering', 'tutorials'],
                'tags' => ['react', 'typescript'],
            ],
            [
                'title' => 'Computer Vision: Object Detection Explained',
                'slug' => 'computer-vision-object-detection-explained',
                'excerpt' => 'Understanding YOLO, R-CNN, and modern object detection architectures.',
                'content' => "# Computer Vision: Object Detection Explained

Object detection is one of the most important tasks in computer vision.

## What is Object Detection?

Object detection involves:
1. **Localization**: Where is the object?
2. **Classification**: What is the object?

## Popular Architectures

### YOLO (You Only Look Once)
- Single-pass detection
- Very fast (real-time)
- Good for edge devices

### R-CNN Family
- Two-stage detection
- Higher accuracy
- More computationally intensive

## Implementation Example

```python
import torch
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
results = model('image.jpg')
results.show()
```

## Conclusion

Choose your architecture based on speed vs accuracy requirements.",
                'author_name' => 'Sajjad Aghapour',
                'status' => 'draft',
                'is_featured' => false,
                'published_at' => null,
                'categories' => ['artificial-intelligence', 'research'],
                'tags' => ['python', 'computer-vision', 'deep-learning', 'pytorch'],
            ],
        ];

        foreach ($posts as $postData) {
            $categoryIds = [];
            foreach ($postData['categories'] as $categorySlug) {
                $category = BlogCategory::where('slug', $categorySlug)->first();
                if ($category) {
                    $categoryIds[] = $category->id;
                }
            }

            $tagIds = [];
            foreach ($postData['tags'] as $tagSlug) {
                $tag = BlogTag::where('slug', $tagSlug)->first();
                if ($tag) {
                    $tagIds[] = $tag->id;
                }
            }

            unset($postData['categories'], $postData['tags']);

            $post = BlogPost::create($postData);
            $post->categories()->attach($categoryIds);
            $post->tags()->attach($tagIds);
        }
    }
}
