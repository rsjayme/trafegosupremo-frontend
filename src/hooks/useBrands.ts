import { useQuery } from "@tanstack/react-query";
import { brandsService } from "@/services/brands";

export function useBrands(onlyConnected: boolean = true) {
    return useQuery({
        queryKey: ["brands", { onlyConnected }],
        queryFn: () => onlyConnected ? brandsService.listConnectedBrands() : brandsService.listBrands(),
    });
}