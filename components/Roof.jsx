import Image from "next/image";
import Link from "next/link";
import styles from "./Roof.module.css";

// Editorial explainer: one approved image, six accessible labels.
// No scroll interception, pinned section, WebGL, layered PNGs or animation runtime.
const LAYERS = [
  { title: "Couverture", subtitle: "Rénovation", href: "/prestations/renovation-toiture" },
  { title: "Liteaux", subtitle: "Fixation", href: "/prestations/renovation-toiture" },
  { title: "Écran de sous-toiture", subtitle: "Protection", href: "/prestations/etancheite" },
  { title: "Isolation", subtitle: "Selon l'intervention", href: "/prestations" },
  { title: "Charpente", subtitle: "Selon l'intervention", href: "/prestations" },
  { title: "Zinguerie & évacuation", subtitle: "Gouttières et raccords", href: "/prestations/zinguerie-gouttieres" },
];

export default function Roof() {
  return (
    <section className={styles.section} id="au-coeur-de-votre-toiture" aria-labelledby="roof-editorial-title">
      <div className={styles.container}>
        <div className={styles.eyebrow}>
          <span>02. — LA TOITURE, DE L’EXTÉRIEUR À L’INTÉRIEUR</span>
          <span className={styles.eyebrowRight}>COMPRENDRE POUR MIEUX RÉNOVER</span>
        </div>

        <div className={styles.layout}>
          <div className={styles.intro}>
            <span className={styles.number}>02.</span>
            <h2 id="roof-editorial-title">Au cœur<br />de votre<br /><em>toiture.</em></h2>
            <p>Découvrez les différentes couches de votre toiture et les zones où notre savoir-faire intervient.</p>
            <div className={styles.introFoot}>
              <span>UN ENSEMBLE COMPLET</span>
              <p>Chaque détail contribue à protéger durablement votre habitation.</p>
            </div>
          </div>

          <figure className={styles.visual}>
            <div className={styles.imageStage}>
              <Image
                src="/images/toiture/vue-eclatee.png"
                alt="Vue éclatée photoréaliste d'une toiture : tuiles de couverture, liteaux, écran de protection, isolation, charpente et gouttière en zinc."
                width={1122}
                height={1402}
                sizes="(max-width: 680px) 100vw, (max-width: 1020px) 76vw, 49vw"
                className={styles.roofImage}
                quality={90}
              />
            </div>
            <figcaption>Vue éclatée · Composition illustrative d’une toiture</figcaption>
          </figure>

          <div className={styles.parts} aria-label="Les six éléments de la toiture">
            <div className={styles.partsTop}>
              <span>LES SIX ÉLÉMENTS</span>
              <span>01 — 06</span>
            </div>
            <ol className={styles.partsList}>
              {LAYERS.map((part, i) => (
                <li className={styles.part} key={part.title}>
                  <Link href={part.href} className={styles.partLink} aria-label={part.title + " : " + part.subtitle + " — découvrir la prestation"}>
                    <span className={styles.dot} aria-hidden="true">+</span>
                    <span className={styles.partCopy}>
                      <small>{"0" + (i + 1)}</small>
                      <strong>{part.title}</strong>
                      <em>{part.subtitle}</em>
                    </span>
                    <span className={styles.arrow} aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className={styles.disclaimer}>Les éléments et leur disposition peuvent varier selon la construction et les travaux réalisés.</p>
          </div>
        </div>

        <div className={styles.footer}>
          <a className={styles.assembledLink} href="/images/toiture/vue-assemblee.png" target="_blank" rel="noopener noreferrer" aria-label="Ouvrir la photographie de la toiture assemblée dans un nouvel onglet">
            <span className={styles.thumbnail}>
              <Image src="/images/toiture/vue-assemblee.png" alt="" width={96} height={96} sizes="84px" quality={90} />
            </span>
            <span><strong>Vue complète</strong><small>Découvrir la toiture assemblée ↗</small></span>
          </a>
          <Link href="/prestations" className={styles.allServices}>Explorer nos prestations <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </section>
  );
}
