import { GetStaticPaths, GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/react"
import { PrismicClient } from "../../../services/prismic"
import * as prismicH from '@prismicio/helpers'
import Head from "next/head"

import styles from '../post.module.scss'
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/router"

interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}


export default function PostPreview({ post }: PostPreviewProps) {
    
    const { data: session } = useSession()
    const router = useRouter()


    useEffect(() => {
        // @ts-ignore
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`)
        }
    }, [session])

    return (
        <>
            <Head>
                <title>{post.title} | TNetRunner</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content}}
                    />

                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                            <a>Subscribe now! 😎</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}


export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    // @ts-ignore
    const { slug } = params;
    
    const prismic = PrismicClient()

    const response = await prismic.getByUID('posts', String(slug), {})

    const post = {
        slug,
        title: prismicH.asText(response.data.title),
        content: prismicH.asHTML(response.data.content.splice(0, 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year:'numeric'
        })
    };

    return {
        props: {
            post
        },
        redirect: 60 * 30 // 30 minutes
    }
}