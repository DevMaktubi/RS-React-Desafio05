import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
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
              <img src="/images/calendar.svg" alt="Calendar" />
              <p>{post.first_publication_date}</p>
            </div>
            <div className={styles.postAuthor}>
              <img src="/images/author.svg" alt="Author" />
              <p>{post.data.author}</p>
            </div>
            <div className={styles.postReadingTime}>
              <img src="/images/clock.svg" alt="Reading time" />
              <p>4 min</p>
            </div>
          </div>
          {post.data.content.map(content => (
            <div key={content.heading} className={styles.postContentSection}>
              <h2 className={styles.postContentSectionTitle}>
                {content.heading}
              </h2>
              {content.body.map(body => (
                <p key={body.text} className={styles.postContentSectionText}>
                  {body.text}
                </p>
              ))}
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
