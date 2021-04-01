import { FaRegCalendar, FaRegClock, FaRegUser } from 'react-icons/fa';
import { GetStaticPaths, GetStaticProps } from 'next';

import Head from 'next/head';
import Header from '../../components/Header';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import commonStyles from '../../styles/common.module.scss';
import { format } from 'date-fns';
import { getPrismicClient } from '../../services/prismic';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const readingTime = post?.data.content.reduce((accumulator, content) => {
    const allText = `${content.heading} ${RichText.asText(content.body)}`;

    return accumulator + Math.ceil(allText.split(' ').length / 200);
  }, 0);

  return (
    <>
      <Head>
        <title>{post?.data.title} | Ignews</title>
      </Head>

      <Header />

      {router.isFallback ? (
        <div className={styles.fallback}>Carregando...</div>
      ) : (
        <>
          <img
            className={styles.banner}
            src={post?.data.banner.url}
            alt="illustration"
          />

          <main className={styles.container}>
            <article className={styles.post}>
              <h1>{post?.data.title}</h1>
              <div className={styles.postInformation}>
                <div>
                  <FaRegCalendar size={20} />
                  <time>
                    {format(
                      new Date(post?.first_publication_date),
                      `dd MMM yyyy`,
                      {
                        locale: ptBR,
                      }
                    )}
                  </time>
                </div>
                <div>
                  <FaRegUser size={20} />
                  <span>{post?.data.author}</span>
                </div>
                <div>
                  <FaRegClock size={20} />
                  <span>{readingTime} min</span>
                </div>
              </div>

              {post?.data.content.map(groupContent => (
                <div className={styles.postContent} key={groupContent.heading}>
                  <h2>{groupContent.heading}</h2>
                  <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(groupContent.body),
                    }}
                  />
                </div>
              ))}
            </article>
          </main>
        </>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 5,
    }
  );

  const uidPosts = response.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths: uidPosts,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutes
  };
};
