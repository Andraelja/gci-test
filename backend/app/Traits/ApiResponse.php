<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

trait ApiResponse
{
    /**
     * Success response
     */
    protected function successResponse($data, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Error response
     */
    protected function errorResponse(string $message, int $code = 400, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Not found response
     */
    protected function notFoundResponse(string $message = 'Data tidak ditemukan'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * Validation error response
     */
    protected function validationErrorResponse($errors, string $message = 'Validasi gagal'): JsonResponse
    {
        return $this->errorResponse($message, 422, $errors);
    }

    /**
     * Server error response
     */
    protected function serverErrorResponse(string $message = 'Terjadi kesalahan server'): JsonResponse
    {
        return $this->errorResponse($message, 500);
    }
}