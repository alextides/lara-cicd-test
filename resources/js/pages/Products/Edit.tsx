import { Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { InfoIcon } from 'lucide-react';
import { route } from 'ziggy-js';

interface Product {
    id: number,
    name: string,
    price: number,
    description: string
}

interface Props {
    product: Product
}

export default function Edit({product}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        price: product.price,
        description: product.description,
    });

    const hadleUpdate = (e: React.ChangeEvent) => {
        e.preventDefault();
        // console.log(data);
        // put("/products/store");
        put(route('products.update', product.id));
    }

    return (
        <>
            <Head title="Update a Product" />
            <div className='w-8/12 p-4'>
                <form onSubmit={ hadleUpdate } className='sapce-y-4'>
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
                    <Button disabled={ processing } type='submit'>Update Product</Button>
                </form>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Edit a Product',
            href: '/products/edit',
        },
    ],
};
