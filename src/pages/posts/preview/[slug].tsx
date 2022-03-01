import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/react"
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";
import styles from '../post.module.scss'
interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updateAt: string;
    }
}

export default function PostPreview({ post }: PostPreviewProps) {
    const {data: session} = useSession();
    const router = useRouter()

    useEffect(() => {
        if (session?.activeSubscription)
        {
            router.push(`/posts/${post.slug}`)
        }
    }, [session])

    return (
        <>
            <Head>
                <title>{post.title} / Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updateAt}</time>
                    <div
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                            <a>Subscribe now</a>
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

    /*
    Selecionando paginas para serem geradas no build
    return {
        paths: [
            { params: {slug: 'serveless-quando-utilizar-e-aplicacoes-com-nodejs'} }
        ],
        fallback: 'blocking'
    }
    */
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;    

    const prismic = getPrismicClient();

    const response = await prismic.getByUID<any>('publication', String(slug), {});

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0,3)),
        updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post
        },
        revalidate: 60*30
    }

}

// getStaticPaths - só existe quando tem parametrizacao na pagina, exemplo: [slug].tsx
// paths: se passar array vazio, todos carregam quando acessar a pagina, se passar um objeto vai ser carregado no build estatico
// fallback: true, false, blocking
// fallback true - se a pagina nao foi gerada de forma estatica, força a pagina carregar pelo browser - 
// carrega sem o conteudo e depois aparece
// fallback false - se o post nao foi gerado de forma estatica ainda, ele vai retornar um 404, nao foi encontrado.
// fallback blocking - quando acessar um conteudo que nao foi gerado de forma estatica, ele vai carregar o conteudo novo
// porem vai carregar na camada do server side rendering (nextjs)


// Categorias (30)
// Produtos (1000)

// /camisetas
// /calcas
// /meias

// Gerar as paginas estaticas durante a build
// camisetas.html
// calcas.html
// quando tem pouca pagina - Categoria


// Gerar a pagina estatica no primeiro acesso
// a primeira pessoa que acessar a pagina, ela vai gerar e armazenar a pagina estatica
// quando tem muita pagina - Produtos


// Metade - metade no build e metade quando o usuario acessar e ela gerar e armazenar
// As paginas que mais sao utilizadas, gera no build, as que menos acessam quando o usuario acessa

