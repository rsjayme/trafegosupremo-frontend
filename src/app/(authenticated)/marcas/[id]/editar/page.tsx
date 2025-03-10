import { EditBrandPage } from "@/components/brands/EditBrandPage";

interface PageProps {
    eita: {
        id: string;
    };
}

export default function EditarMarca({ eita }: PageProps) {
    return <EditBrandPage brandId={eita.id} />;
}