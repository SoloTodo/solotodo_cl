import {Button, Alert} from "@mui/material";
import {Category} from "../../frontend-utils/types/store";
import { parseCookies, setCookie } from "nookies";
import {useEffect, useState} from "react";

type CategoryAIDisclaimerProps = {
    category: Category
}

export default function CategoryAIDisclaimer({category} : CategoryAIDisclaimerProps) {
    const [displayAlert, setDisplayAlert] = useState(false)
    const cookieName = `category_ai_disclaimer_dismissed_${category.id}`

    useEffect(() => {
        const cookies = parseCookies()
        console.log(cookieName)
        const categoryAiDisclaimerDismissed = cookies[cookieName]
        console.log(categoryAiDisclaimerDismissed)
        if (!categoryAiDisclaimerDismissed) {
            setDisplayAlert(true)
        }
    }, [])

    if (!category.is_ai_managed || !displayAlert) {
        return null
    }

    const dismissCategoryAiDisclaimer = () => {
        setCookie(null, cookieName, '1', {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        })
        setDisplayAlert(false)
    }

    return (<Alert severity="info" sx={{mb: 3, mt: -2}}>
      Esta categoría está manejada por una IA, confirma el modelo y las características de cada producto antes de comprar.
      <br />
      <Button variant="outlined" sx={{mt: 2}} onClick={dismissCategoryAiDisclaimer}>Entendido</Button>
    </Alert>)
}