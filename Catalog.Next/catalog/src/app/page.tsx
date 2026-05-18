import Link from "next/link";
import Header from "../../components/header";

export default async function Home() {
  return (
    <>
      <Header />
      <main className="page-container">
        <section className="landing-hero">
          <p className="catalog-eyebrow">Private Collection</p>
          <h1>Give the catalog a proper front desk.</h1>
          <p>
            Browse the full library, keep reading states tidy, and update the collection from a cleaner interface
            that does less unnecessary work against Postgres.
          </p>
          <div className="landing-actions">
            <Link href="/books" className="catalog-detail-link">Open catalog</Link>
            <a href="/api/auth/login" className="landing-secondary-action">Sign in</a>
          </div>
        </section>
      </main>
    </>
  )
}
