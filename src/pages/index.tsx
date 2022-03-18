import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement, useEffect, useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { convertData } from '../services/convertData';

import { client } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
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

export default function Home({ postsPagination }: HomeProps): ReactElement {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState<string>(postsPagination.next_page);

  useEffect(() => {
    setPosts(postsPagination.results);
    setNextPage(postsPagination.next_page);
  }, [postsPagination]);

  const loadPosts = async (): Promise<void> => {
    if (nextPage) {
      fetch(nextPage)
        .then(response => response.json())
        .then(data => {
          const newPosts = data.results.map((post: Post) => ({
            uid: post.uid,
            first_publication_date: convertData(
              new Date(post.first_publication_date)
            ),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          }));

          setNextPage(data.next_page);
          setPosts([...posts, ...newPosts]);
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.error('Error fecthing new page.');
        });
    }
  };

  return (
    <>
      <Head>
        <title>Home | Maktub Blog</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts &&
            posts.map(post => (
              <article key={post.uid} className={styles.post}>
                <Link href={`/post/${post.uid}`}>
                  <h2 className={styles.postTitle}>{post.data.title}</h2>
                </Link>
                <p className={styles.postSubtitle}>{post.data.subtitle}</p>
                <div className={commonStyles.postInfo}>
                  <div className={commonStyles.postData}>
                    <FiCalendar size={24} />
                    <p>{post.first_publication_date}</p>
                  </div>
                  <div className={commonStyles.postAuthor}>
                    <FiUser size={24} />
                    <p>{post.data.author}</p>
                  </div>
                </div>
              </article>
            ))}
          {nextPage && (
            <button onClick={() => loadPosts()} type="button">
              <p>Carregar mais posts</p>
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const result = await client.getByType('posts', {
    page: 1,
    pageSize: 1,
  });
  const posts: Post[] = result.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: convertData(
        new Date(post.first_publication_date)
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });
  const { next_page } = result;

  const postsPagination: PostPagination = {
    next_page,
    results: posts,
  };
  return {
    props: {
      postsPagination,
    },
  };
};
