import Link from "next/link";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {

    return <>
        <header className="site-header">
            <div className="site-header-inner">
                <Link href="/" className="site-brand">
                    <span className="site-brand-icon"><AutoStoriesIcon /></span>
                    <span>
                        <strong>BookCatalog</strong>
                        <small>Curated shelf management</small>
                    </span>
                </Link>

                <nav className="site-nav">
                    <Link href="/books">Catalog</Link>
                    <a href="/api/auth/logout" className="site-logout" aria-label="Logout">
                        <LogoutIcon fontSize="small" />
                        <span>Logout</span>
                    </a>
                </nav>
            </div>
        </header>
    </>
}
