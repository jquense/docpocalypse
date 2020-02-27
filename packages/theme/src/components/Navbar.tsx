import { css as dcss } from 'astroturf';
import cn from 'classnames';
import { Link, graphql, useStaticQuery } from 'gatsby';
import React from 'react';

const styles = dcss`
  @component Navbar {
    @apply sticky z-40 top-0 px-4 text-white bg-primary;


    & .brand {
      @apply text-3xl font-medium tracking-wide font-brand;

      text-shadow: 0 1px theme(colors.gray.600);
    }
    & .container {
      @apply max-w-screen-xl mx-auto flex items-center;

      height: theme('height.navbar');
    }

    & .content {
      @apply ml-auto;
    }
  }
`;

/** @public */
const Navbar = (props: React.HTMLProps<HTMLDivElement>) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div {...props} className={cn(props.className, styles.Navbar)}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          {site.siteMetadata?.title ?? 'Documentation'}
        </Link>
        <span className={styles.content}>{props.children}</span>
      </div>
    </div>
  );
};

export default Navbar;
