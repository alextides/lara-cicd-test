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
import { useState } from 'react';

interface User {
    id: number,
    name: string,
    email: string,
    type: string,
    status: string
}

interface PageProp{
    flash: {
        message?: string
    }
    users: User[]
}

export default function Index() {
    const { users, flash } = usePage().props as PageProps;
    
    return (
        <>
            <Head title="Users" />
            <div className='m-4'>
                <div>
                    <Link href=''><Button>Create a User</Button></Link>
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
            {users.length > 0 && (


            <Table>
            <TableCaption>A list of your recent users.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { users.map((user: any) => (
                    <TableRow>
                    <TableCell className="font-medium">{ user.id }</TableCell>
                    <TableCell>{ user.name }</TableCell>
                    <TableCell>{ user.email }</TableCell>
                    <TableCell>test</TableCell>
                    <TableCell>test</TableCell>
                    <TableCell className="text-right">
                        <Link href=''><Button className='bg-gray-500 hover:bg-gray-700 mr-2'>Edit</Button></Link>
                        <Button className='bg-red-500 hover:bg-red-700'>Delete</Button>
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
            title: 'Users',
            href: '/users',
        },
    ],
};
