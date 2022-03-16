import { GetStaticProps } from 'next';

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

export default function Home({}: HomeProps) {
  return <h1>HELLO THERE!</h1>;
}

export const getStaticProps = async () => {
  const posts = await client.getAllByType('post');
  // TODO
  return {
    props: {
      posts,
    },
  };
};
