import { GetServerSideProps } from "next"
import { getSession, useSession } from "next-auth/react"
import { PrismicClient } from "../../services/prismic"
import { useRouter } from "next/router"
import { useEffect } from "react"
import * as prismicH from '@prismicio/helpers'
import Head from "next/head"

import styles from './post.module.scss'


interface PostProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}


export default function Post({ post }: PostProps) {

    const { data: session } = useSession()
    const router = useRouter()


    useEffect(() => {
        //@ts-ignore
        if (!session || !session?.activeSubscription) {
            router.push(`/posts/preview/${post.slug}`)
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
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{ __html: post.content}}
                    />
                </article>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req })
    // @ts-ignore
    const { slug } = params;

    // @ts-ignore
    const prismic = PrismicClient(req)

    const response = await prismic.getByUID('posts', String(slug), {})

    const post = {
        slug,
        title: prismicH.asText(response.data.title),
        content: prismicH.asHTML(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year:'numeric'
        })
    };

    return {
        props: {
            post
        }
    }
}