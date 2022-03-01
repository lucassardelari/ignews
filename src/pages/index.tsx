import { GetServerSideProps, GetStaticProps } from 'next';
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscriveButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product } : HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

// GetServerSideProps - caso o site tiver N acessos simultaneos, ele vai realizar a chamada N vezes
// como se estivesse instanciando cada vez que algum usuario abrir o site
// Permite ser mais dinamico, exemplo: chamada por Usuario! Caso voce utilize algo relacionado
// ao usuario, Bem vindo Lucas, se utilizar o getstaticprops ele vai exibir isto para todos os usuarios.

// GetStaticProps - voce consegue definir atravez da propriedade revalidate, depois de quanto tempo
// o site deverá ser recarregado caso precise. Exemplo, se a pagina nao vai alterar seu valor sempre
// add um revalidate com um tempo legal, para que nao precise ser recarregado a cada usuario que acessar.
//Executa 1x e depois salva o html e executa apenas ele.

// Nao substitui uma chamada API, caso voce nao precise do valor para os motores de busca, realizar
// a chamada normal.

// Client-side - Nao precisa de indexacao, uma info que é carregada com a ação do usuario.
// Server-side - Precisa da indexacao, porem precisa de dados em tempo real de usuario
// Static Site Generation - Compartilhar o mesmo html com todos que usam. Pagina de produtos

// Post do blog
// Conteudo (SSG)
// Comentarios (Client-side)
// Sempre verificar performance, o Client-side é bem mais rapido que o Server-side

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KVodNKzU1Tm09u5u4CmTToH', {
    expand: ['product']
  })

  const product = {
    priceID: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
  }

  //expand, quando quer fazer tabela de preço, consegue buscar o titulo do produto, imagem entre outros.
  
  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24hours
  }
}