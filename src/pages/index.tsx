import { FaRegCalendar, FaRegUser } from 'react-icons/fa';

import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import commonStyles from '../styles/common.module.scss';
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Home | spacetraveling.</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <Link href="/">
            <a>
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.postInformation}>
                <div>
                  <FaRegCalendar size={20} />
                  <time>19 Abr 2021</time>
                </div>
                <div>
                  <FaRegUser size={20} />
                  <span>Joseph Oliveria</span>
                </div>
              </div>
            </a>
          </Link>

          <Link href="/">
            <a>
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.postInformation}>
                <div>
                  <FaRegCalendar size={20} />
                  <time>19 Abr 2021</time>
                </div>
                <div>
                  <FaRegUser size={20} />
                  <span>Joseph Oliveria</span>
                </div>
              </div>
            </a>
          </Link>
        </div>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
