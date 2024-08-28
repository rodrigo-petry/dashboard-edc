import Image, { StaticImageData } from "next/image";

import logoFull from "@images/logo_full.png";
import logoIcon from "@images/logo_icon.png";

import logoTriotec from "@images/logo_triotec.png";
import { useUser } from "@core/domain/Dashboards/Dashboards.hooks";

export function FullLogo() {
    const { data } = useUser();
    
    const getImagePath = ():string|StaticImageData => {
        if(data?.email == "marcos.sousa@triotec.eng.br" || data?.email == "davi.nogueira@triotec.eng.br") {
            return logoTriotec;
        }

        return logoFull;
    }

    return <>
        {getImagePath() != "" && <Image src={ getImagePath() } alt="Energia das Coisas" />}
    </>
}

export function LogoIcon() {
    const { data } = useUser();
    
    const getImagePath = ():string|StaticImageData  => {
        if(data?.email == "marcos.sousa@triotec.eng.br" || data?.email == "davi.nogueira@triotec.eng.br") {
            return "";
        }

        return logoIcon;
    }

    return <>
        {getImagePath() != "" && <Image src={ getImagePath() } alt="Energia das Coisas" />}
    </>
}