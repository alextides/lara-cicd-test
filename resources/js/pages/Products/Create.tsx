import { Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { InfoIcon } from 'lucide-react';
import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import axios from 'axios';

interface UploadResponse {
    success: boolean;
    message: string;
    path: string;
    url: string;
}

export default function Create(): React.JSX.Element {
    // Add product input below:
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        price: "",
        description: "",
    });

    // const hadleSubmit = (e: React.ChangeEvent) => {
    //     e.preventDefault();
    //     console.log(data);
    //     post("/products/store");
    // }
    // Add product input end


    // File upload below:
    const [isDragActive, setIsDragActive] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string>('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    
    // Explicitly type the input reference element
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Explicit drag event typing for standard React events
    const handleDrag = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    // Explicit drop event typing
    const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    // Explicit change event typing for the input field
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (selectedFile: File): void => {
        setFile(selectedFile);
        setStatus(`Selected: ${selectedFile.name}`);
    };

    const onButtonClick = (): void => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.ChangeEvent): Promise<void> => {
         e.preventDefault();
        if (!file) {
            setStatus('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('document', file); 

        setStatus('Uploading...');

        try {
            // Apply your Response interface to the Axios template payload type
            const response = await axios.post<UploadResponse>('/products/store', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            setStatus(`Success! File stored at: ${response.data.path}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMsg = error.response?.data?.message || 'Upload failed.';
                setStatus(`Error: ${errorMsg}`);
            } else {
                setStatus('An unexpected error occurred.');
            }
        }
    };
    // File upload end

    return (
        <>
            <Head title="Create a New Products" />
            <div className='w-8/12 p-4'>
                <form onSubmit={ handleSubmit } className='sapce-y-4'>
                    {/* Display Error */}
                    {Object.keys(errors).length > 0  && (
                        <Alert>
                        <InfoIcon />
                        <AlertTitle>Errors!</AlertTitle>
                        <AlertDescription>
                            <ul>
                                {Object.entries(errors).map(([key, message]) =>(
                                    <li key={key}>{message as string}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                        </Alert>
                    )}
                    <div className='gap-1.5'>
                        <Label htmlFor='product name'>Name</Label>
                        <Input placeholder='Product Name' value={ data.name } onChange={(e) => setData("name", e.target.value)}></Input>
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor='product price'>Price</Label>
                        <Input placeholder='Product Price' value={ data.price } onChange={(e) => setData("price", e.target.value)}></Input>
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor='product description'>Description</Label>
                        <Textarea placeholder='Product Description' value={ data.description } onChange={(e) => setData("description", e.target.value)}></Textarea>
                    </div>

                    {/* File Upload */}
                    <div style={{ maxWidth: '400px', margin: '20px auto', fontFamily: 'sans-serif' }}>
                        <div 
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            onClick={onButtonClick}
                            style={{
                                border: isDragActive ? '2px dashed #4F46E5' : '2px dashed #D1D5DB',
                                backgroundColor: isDragActive ? '#EEF2FF' : '#F9FAFB',
                                borderRadius: '8px',
                                padding: '40px 20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                style={{ display: 'none' }} 
                                onChange={handleChange}
                                accept=".jpg,.jpeg,.png,.pdf,.docx,.zip"
                            />
                            <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
                                {isDragActive ? "Drop your file here!" : "Drag & drop your file here"}
                            </p>
                            <span style={{ fontSize: '14px', color: '#6B7280' }}>or click to browse</span>
                        </div>

                        {status && <p style={{ fontSize: '14px', margin: '12px 0', color: '#374151' }}>{status}</p>}

                        {/* <button 
                            onClick={handleSubmit}
                            disabled={!file}
                            style={{
                                width: '100%',
                                backgroundColor: file ? '#4F46E5' : '#9CA3AF',
                                color: 'white',
                                border: 'none',
                                padding: '10px',
                                borderRadius: '6px',
                                cursor: file ? 'pointer' : 'not-allowed',
                                fontWeight: '600'
                            }}
                        >
                            Upload File
                        </button> */}
                    </div>
                    {/* File Upload End*/}

                    <Button disabled={ processing } type='submit'>Add Product</Button>
                </form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Create a New Products',
            href: '/products/create',
        },
    ],
};
