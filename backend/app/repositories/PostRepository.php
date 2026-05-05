<?php
namespace App\Repositories;

use App\Models\Post;

class PostRepository
{
    protected Post $model;

    public function __construct(Post $model)
    {
        $this->model = $model;
    }

    public function getAll(int $perPage = 10)
    {
        return $this->model->newQuery()->paginate($perPage);
    }

    public function getDetail(string $id): Post
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data): Post
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): ?Post
    {
        $post = $this->model->find($id);
        if ($post) {
            $post->update($data);
            return $post;
        }
        return null;
    }

    public function delete(string $id): bool
    {
        $post = $this->model->find($id);
        if ($post) {
            return (bool) $post->delete();
        }
        return false;
    }
}
