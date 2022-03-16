import { GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { formatDate } from '../services/convertData';

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

export default function Home({ postsPagination }: HomeProps) {
  return <h1>HELLO THERE!</h1>;
}

export const getStaticProps = async () => {
  const result = await client.getAllByType('posts');
  console.log(result);
  const posts = result.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
      date: formatDate(new Date(post.first_publication_date)),
    };
  });
  // TODO
  return {
    props: {
      posts,
    },
  };
};
