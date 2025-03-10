import { EditBrandPage } from "@/components/brands/EditBrandPage";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditarMarca({ eita }: any) {
    return <EditBrandPage brandId={eita.id} />;
}