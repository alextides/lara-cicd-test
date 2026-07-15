<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return Inertia::render('Products/Index', compact('products'));
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'string|max:255|unique:products,name',
            'price' => 'numeric',
            'description' => 'string|nullable',
            'document' => [
                'file',
                'max:10240', // 10MB Limit
                'mimes:jpg,jpeg,png,pdf,docx,zip' // Allowed formats
            ],
        ]);

        // 2. Check if the file is valid and present
        if ($request->hasFile('document') && $request->file('document')->isValid()) {
            $file = $request->file('document');

            // 3. Store file securely using a unique hash name to prevent directory traversal
            $path = $file->store('uploads', 'public'); 

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully!',
                'path'    => $path,
                'data'    => [
                    'name'    => $validatedData['name'],
                    'price'    => $validatedData['price'],
                    'decription'    => $validatedData['decription'],
                    'url'     => Storage::url($path),
                ]
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid file payload.',
        ], 400);

        // Product::create($request->all());
        // return redirect()->route('products.index')->with('message', 'Product created successfully!');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('message', 'Product deleted successfully!');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', compact('product'));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        $product->update([
            'name' => $request->input('name'),
            'price' => $request->input('price'),
            'description' => $request->input('description'),
        ]);
        return redirect()->route('products.index')->with('message', 'Product updated successfully!');
    }

    // public function upload(Request $request): JsonResponse
    // {
    //     // 1. Validate the file payload
    //     $request->validate([
    //         'document' => [
    //             'required',
    //             'file',
    //             'max:10240', // 10MB Limit
    //             'mimes:jpg,jpeg,png,pdf,docx,zip' // Allowed formats
    //         ],
    //     ]);

    //     // 2. Check if the file is valid and present
    //     if ($request->hasFile('document') && $request->file('document')->isValid()) {
    //         $file = $request->file('document');

    //         // 3. Store file securely using a unique hash name to prevent directory traversal
    //         $path = $file->store('uploads', 'public'); 

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'File uploaded successfully!',
    //             'path'    => $path,
    //             'url'     => Storage::url($path),
    //         ], 200);
    //     }

    //     return response()->json([
    //         'success' => false,
    //         'message' => 'Invalid file payload.',
    //     ], 400);
    // }
}
