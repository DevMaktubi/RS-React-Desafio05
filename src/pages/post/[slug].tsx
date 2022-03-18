import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { ReactElement } from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { convertData } from '../../services/convertData';

import { client } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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

export default function Post({ post }: PostProps): ReactElement {
  const router = useRouter();
  return router.isFallback ? (
    <div>Carregando...</div>
  ) : (
    <>
      <Head>
        <title>{post.data.title} | Maktub Blog</title>
      </Head>
      <main className={styles.postContainer}>
        <img
          className={styles.postBanner}
          src={post.data.banner.url}
          alt="Post Banner"
        />
        <article className={styles.postContent}>
          <h1 className={styles.postTitle}>{post.data.title}</h1>
          <div className={commonStyles.postInfo}>
            <div className={commonStyles.postData}>
              <FiCalendar size={24} />
              <p>{post.first_publication_date}</p>
            </div>
            <div className={styles.postAuthor}>
              <FiUser size={24} />
              <p>{post.data.author}</p>
            </div>
            <div className={styles.postReadingTime}>
              <FiClock size={24} />
              <p>4 min</p>
            </div>
          </div>
          {post.data.content.map((content, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className={styles.postContentSection}>
              <h2 className={styles.postContentSectionTitle}>
                {content.heading}
              </h2>
              <div
                className={styles.postContentSectionText}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </div>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await client.getAllByType('posts');
  const paths = posts.map(post => ({
    params: {
      slug: post.uid,
    },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const response = await client.getByUID('posts', String(slug));

  const post: Post = {
    first_publication_date: convertData(
      new Date(response.first_publication_date)
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };
  return {
    props: {
      post,
    },
  };
};
