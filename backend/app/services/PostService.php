<?php

namespace App\Services;

use App\Models\Post;
use App\Repositories\PostRepository;
use Illuminate\Http\Request;

class PostService
{
    protected PostRepository $postRepository;

    public function __construct(PostRepository $postRepository)
    {
        $this->postRepository = $postRepository;
    }

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        return $this->postRepository->getAll($perPage);
    }

    public function create(array $data): Post
    {
        return $this->postRepository->create($data);
    }

    public function getPostById(string $id): ?Post
    {
        return $this->postRepository->getDetail($id);
    }

    public function updatePost(string $id, array $data): ?Post
    {
        return $this->postRepository->update($id, $data);
    }

    public function deletePost(string $id): bool
    {
        return $this->postRepository->delete($id);
    }
}
