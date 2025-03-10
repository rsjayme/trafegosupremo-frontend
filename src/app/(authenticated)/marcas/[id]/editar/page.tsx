import { EditBrandPage } from "@/components/brands/EditBrandPage";

interface PageProps {
    params: {
        id: string;
    };
}

export default function EditarMarca({ params }: PageProps) {
    return <EditBrandPage brandId={params.id} />;
}