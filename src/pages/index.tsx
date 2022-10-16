import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { SubscribeButton } from '../components/SubscribeButton'

import styles from './home.module.scss'
import {stripe} from '../services/stripe'


interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}


const Home = ({product}: HomeProps) => {
  return (
    <>
      <Head>
        <title>Home | T.NetRunner</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
            <span>Hello, friend 👋</span>
            <h1>Always stay up to date with the news from the<br />
             <span>CyberSecurity</span> world!</h1>

            <p>Get access to all the publications <br />
             <span>for {product.amount} month</span>
            </p>
            <SubscribeButton priceId={product.priceId} />
        </section>
        <div className={styles.imageContainer}>
          <Image src="/images/avatar.png" alt="Cyber Security Man" width={400} height={400} className={styles.image} />
        </div>
        
      </main>
    </>

  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  
  const price = await stripe.prices.retrieve('price_1Lt0EsD8c17G8jOD8FoKNbck');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount! / 100),
  };
  
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours (60s 60m 24h)
  }
}
