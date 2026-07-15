import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { route } from 'ziggy-js';

interface Product {
    id: number,
    name: string,
    price: number,
    description: string
}

interface PageProp{
    flash: {
        message?: string
    }
    products: Product[]
}

export default function Index() {
    const { products, flash } = usePage().props as PageProps;

    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Do you want to delete this product? - ${id} . ${name} `)) {
            // destroy(`/products/${id}`);
            destroy(route("products.destroy", id));

        }
    }
    
    return (
        <>
            <Head title="Products" />
            <div className='m-4'>
                <div>
                    <Link href='/products/create'><Button>Create a Product</Button></Link>
                </div>
            </div>
            <div className='m-4'>
                <div>
                    { flash.message && (
                        <Alert>
                        <Megaphone className='h-4 w-4'/>
                        <AlertTitle>Notification!</AlertTitle>
                        <AlertDescription>
                            { flash.message }
                        </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            {products.length > 0 && (
            <Table>
            <TableCaption>A list of your recent products.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { products.map((product: any) => (
                    <TableRow>
                    <TableCell className="font-medium">{ product.id }</TableCell>
                    <TableCell>{ product.name }</TableCell>
                    <TableCell>{ product.price }</TableCell>
                    <TableCell>{ product.description }</TableCell>
                    <TableCell className="text-right">
                        <Link href={ route('products.edit', product.id) }><Button className='bg-gray-500 hover:bg-gray-700 mr-2'>Edit</Button></Link>
                        {/* <Link href='/products/'><Button className='bg-gray-500 hover:bg-gray-700 mr-2'>Edit</Button></Link> */}
                        <Button disabled={ processing } onClick={() => handleDelete(product.id, product.name)} className='bg-red-500 hover:bg-red-700'>Delete</Button>
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
            )}
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: '/products',
        },
    ],
};

