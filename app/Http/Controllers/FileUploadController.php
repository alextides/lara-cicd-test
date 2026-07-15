<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;

class FileUploadController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        // Validate the uploaded file using modern 2026 strict file rules
        $request->validate([
            'file' => [
                'required',
                File::types(['jpg', 'jpeg', 'png', 'pdf', 'docx'])
                    ->max(10 * 1024), // Maximum 10MB
            ],
        ]);

        if ($request->file('file')->isValid()) {
            // Save file securely to the public disk under 'uploads' directory
            $path = $request->file('file')->store('uploads', 'public');
            
            // Generate full accessible asset URL
            $url = asset(Storage::url($path));

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully!',
                'url' => $url,
                'path' => $path
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid file upload.'
        ], 400);
    }
}
