import Image from "next/image"
import Link from "next/link"
import { ActiveLink } from "../ActiveLink"
import { SignInButton } from "../SignInButton"
import styles from "./styles.module.scss"

export function Header () {

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <div>
                    <Link href="/">
                        <a>
                            <Image src="/images/logo.png" alt="logo" width={60} height={60}/>
                        </a>
                    </Link>
                </div>
                <Link href="/"><h2>t.NetRunner</h2></Link>
                <nav>
                    <ActiveLink activeClassName={styles.active} href="/">
                        <a>Home</a>
                    </ActiveLink>

                    <ActiveLink activeClassName={styles.active} href="/posts">
                        <a >Posts</a>
                    </ActiveLink>
                </nav>

                <SignInButton />
            </div>
        </header>
    )
}