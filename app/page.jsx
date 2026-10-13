import Link from "next/link";
import Roof from "../components/Roof";
import Cta from "../components/Cta";
import { SERVICES, PROJECTS, PHOTO_NOTE } from "../lib/data";
import styles from "./home.module.css";

// Existing service and project illustrations are preserved.
// The roof exploded artwork is the original approved PNG in public/images/toiture.
const heroImage = "https://images.unsplash.com/photo-1655751583650-83e331f71749?auto=format&fit=crop&w=2000&q=85";

export default function Home() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="home-hero-title">
        <div className={styles.heroPhoto} style={{ backgroundImage: 'url("' + heroImage + '")' }} role="img" aria-label="Bordeaux au soleil couchant" />
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>ARTISAN COUVREUR · BORDEAUX & ALENTOURS</p>
          <h1 id="home-hero-title">Le<br />savoir-faire<br /><em>au sommet.</em></h1>
          <p className={styles.heroSub}>Couverture, rénovation et étanchéité à Bordeaux et dans les communes voisines.</p>
          <div className={styles.heroActions}>
            <Link href="/demande-de-devis" className={styles.lightButton}>Demander un devis <span aria-hidden="true">↗</span></Link>
            <Link href="/prestations/urgence-toiture" className={styles.outlineButton}>Urgence toiture <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className={styles.heroBottom}>
          <span>DES TOITURES QUI TRAVERSENT LE TEMPS</span>
          <a href="#expertises">DÉCOUVRIR NOS EXPERTISES <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className={styles.expertise} id="expertises" aria-labelledby="home-expertise-title">
        <div className={styles.shell}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIndex}>01.</span>
            <div>
              <p className={styles.miniLabel}>LE CHAMP DE NOS INTERVENTIONS</p>
              <h2 id="home-expertise-title">Nos expertises.</h2>
            </div>
            <Link href="/prestations" className={styles.headerLink}>Toutes les prestations <span aria-hidden="true">↗</span></Link>
          </div>
          <div className={styles.serviceGrid}>
            {SERVICES.map((service, index) => (
              <Link href={"/prestations/" + service.slug} key={service.slug} className={styles.serviceCard}>
                <span className={styles.servicePhoto} style={{ backgroundImage: 'url("' + service.image + '")' }} aria-hidden="true" />
                <span className={styles.serviceLine}>
                  <span className={styles.serviceNumber}>{"0" + (index + 1)}</span>
                  <strong>{service.title}</strong>
                  <span className={styles.serviceArrow} aria-hidden="true">↗</span>
                </span>
              </Link>
            ))}
          </div>
          <p className={styles.serviceNote}>Chaque toiture est différente. Nous adaptons les interventions à l’état de l’existant.</p>
        </div>
      </section>

      <Roof />

      <section className={styles.craft} aria-labelledby="craft-heading">
        <div className={styles.craftPhoto} role="img" aria-label="Architecture et détails de toiture" />
        <div className={styles.craftCopy}>
          <span className={styles.craftEyebrow}>LE GESTE & LA MATIÈRE</span>
          <h2 id="craft-heading">Des toitures<br />qui traversent<br /><em>le temps.</em></h2>
          <p>Un chantier réussi se reconnaît dans le soin apporté aux détails. De l’étude des besoins aux finitions, nous recherchons la solution adaptée à chaque habitation.</p>
          <Link href="/entreprise" className={styles.darkLink}>Découvrir notre approche <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className={styles.projects} aria-labelledby="projects-heading">
        <div className={styles.shell}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIndex}>03.</span>
            <div>
              <p className={styles.miniLabel}>L’ATTENTION PORTÉE AUX DÉTAILS</p>
              <h2 id="projects-heading">Réalisations récentes.</h2>
            </div>
            <Link href="/realisations" className={styles.headerLink}>Voir la galerie <span aria-hidden="true">↗</span></Link>
          </div>
          <div className={styles.projectGrid}>
            {PROJECTS.slice(0, 3).map((project, i) => (
              <Link href="/realisations" className={styles.projectCard} key={project.slug}>
                <div className={styles.projectPhoto} style={{ backgroundImage: 'url("' + project.image + '")' }} aria-hidden="true">
                  <span>{"0" + (i + 1)}</span>
                </div>
                <span className={styles.projectMeta}>{project.category} · {project.city}</span>
                <span className={styles.projectBottom}><strong>{project.name}</strong><span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </div>
          <p className={styles.photoNote}>{PHOTO_NOTE}</p>
        </div>
      </section>

      <section className={styles.territory} aria-labelledby="territory-heading">
        <div className={styles.shell + " " + styles.territoryGrid}>
          <div className={styles.territoryCopy}>
            <p className={styles.miniLabel}>04. — PROXIMITÉ</p>
            <h2 id="territory-heading">Nos racines,<br /><em>Bordeaux et ses alentours.</em></h2>
            <p>Basés dans la métropole bordelaise, nous intervenons auprès des particuliers pour leurs projets de couverture et de rénovation.</p>
            <Link href="/zones-intervention" className={styles.darkLink}>Nos zones d’intervention <span aria-hidden="true">↗</span></Link>
          </div>
          <div className={styles.territoryPanel} aria-label="Exemples de communes desservies autour de Bordeaux">
            <span className={styles.panelTop}>GIRONDE · NOUVELLE-AQUITAINE</span>
            <strong>Bordeaux<span>.</span></strong>
            <p>Mérignac · Pessac · Talence · Cenon<br />Le Bouscat et alentours</p>
            <div className={styles.panelBottom}><span>ANCRAGE LOCAL</span><span>↗ 33</span></div>
          </div>
        </div>
      </section>

      <Cta title="Une question ?" description="Parlons de votre projet." />
    </>
  );
}
