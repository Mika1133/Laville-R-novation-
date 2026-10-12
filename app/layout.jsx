import "./globals.css";import {Header,Footer} from "../components/Chrome";
export const metadata={title:{default:"Laville Rénovation | Couvreur à Bordeaux",template:"%s | Laville Rénovation"},description:"Couverture, rénovation de toiture, recherche de fuite, étanchéité et zinguerie à Bordeaux et alentours.",robots:{index:false,follow:false}};
export default function Layout({children}){return <html lang="fr"><body><a href="#main" className="skip">Aller au contenu</a><Header/><main id="main">{children}</main><Footer/></body></html>}
