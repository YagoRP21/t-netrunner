
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { client } from '../../services/prismic'
import * as Prismic from '@prismicio/client'
import styles from './styles.module.scss'
import * as prismicH from '@prismicio/helpers'
import Link from 'next/link'

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string
}

interface PostsProps {
    posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | TNetRunner</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    { posts.map(post => (
                        <Link key={post.slug} href={`/posts/${post.slug}`}>
                            <a>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = client

    // @ts-ignore
    const response = await prismic.get([
        Prismic.predicates.at('document.type', 'Posts')
    ])

    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: prismicH.asText(post.data.title),
            // @ts-ignore
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'long',
                year:'numeric'
            })
        }
    })

    return {
        props: {posts}
    }
}