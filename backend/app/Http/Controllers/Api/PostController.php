<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\PostRequest;
use App\Services\PostService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    use ApiResponse;

    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function index(Request $request)
    {
        $posts = $this->postService->index($request);
        return $this->successResponse($posts, 'Posts retrieved successfully');
    }

    public function detail(string $id)
    {
        $post = $this->postService->getPostById($id);

        return $post
            ? $this->successResponse($post, 'Post retrieved successfully')
            : $this->errorResponse('Post not found', 404);
    }

    public function store(PostRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();
        $data['user_id'] = $user->id;
        $post = $this->postService->create($data);
        return $this->successResponse($post, 'Post created successfully', 201);
    }

    public function update(string $id, PostRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();

        $post = $this->postService->updatePost($id, $data);
        return $post
            ? $this->successResponse($post, 'Post updated successfully')
            : $this->errorResponse('Post not found', 404);
    }

    public function destroy(string $id)
    {
        $deleted = $this->postService->deletePost($id);

        return $deleted
            ? $this->successResponse(null, 'Post deleted successfully')
            : $this->errorResponse('Post not found', 404);
    }
}
