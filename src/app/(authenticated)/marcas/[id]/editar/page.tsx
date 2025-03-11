'use client';

import { useParams } from 'next/navigation';
import { EditBrandPage } from "@/components/brands/EditBrandPage";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditarMarca() {
    const params = useParams();


    return <EditBrandPage brandId={params.id as string} />;
}