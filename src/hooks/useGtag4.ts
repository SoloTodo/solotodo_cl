/* eslint-disable react-hooks/exhaustive-deps */
import {useRouter} from "next/router";
import {useEffect} from "react";
import {constants} from "src/config";
import {ga4Event} from "../utils/ga4";

type Props = {
    pageTitle?: string;
    product?: string;
    productId?: string;
    category?: string;
    categoryId?: string;
    store?: string;
    storeId?: string;
    seller?: string;
    sku?: string;
    condition?: string;
    offerPrice?: string;
};

export const useGtag4 = (props: Props) => {
    const router = useRouter();

    useEffect(() => {
        const params = {
            page_title: `${props.pageTitle} | SoloTodo`,
            page_location: `${constants.domain}${router.asPath}`,
            page_path: router.asPath,
            product: props.product,
            product_id: props.productId,
            category: props.category,
            category_id: props.categoryId,
            retailer: props.store,
            retailer_id: props.storeId,
            seller: props.seller,
            condition: props.condition,
            precio: props.offerPrice,
        };
        ga4Event("page_view", params);
    }, [router.asPath]);
};
