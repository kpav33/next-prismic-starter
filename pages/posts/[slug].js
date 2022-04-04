import { useRouter } from "next/router";
import Head from "next/head";
import ErrorPage from "next/error";
import Container from "../../components/container";
import PostBody from "../../components/post-body";
import MoreStories from "../../components/more-stories";
import Header from "../../components/header";
import PostHeader from "../../components/post-header";
import SectionSeparator from "../../components/section-separator";
import Layout from "../../components/layout";
import { getAllPostsWithSlug, getPostAndMorePosts } from "../../lib/api";
import PostTitle from "../../components/post-title";
import { CMS_NAME } from "../../lib/constants";

export default function Post({ post, morePosts, preview }) {
  const router = useRouter();
  // console.log(post, morePosts, preview);
  if (!router.isFallback && !post?._meta?.uid) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {post.title[0].text} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={post.coverimage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverimage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
            </article>
            <SectionSeparator />
            {/* {morePosts && morePosts.length > 0 && (
              <MoreStories posts={morePosts} />
            )} */}
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({
  params,
  preview = false,
  previewData,
  locale,
}) {
  // console.log("LOCALE: ", locale);
  // Pass the appropriate locale to the query
  const passLocale = locale === "en" ? "en-us" : locale;
  const data = await getPostAndMorePosts(params.slug, previewData, passLocale);

  return {
    props: {
      preview,
      post: data?.post ?? null,
      morePosts: data?.morePosts ?? [],
    },
  };
}

export async function getStaticPaths({ locale }) {
  // console.log("STATIC PATHS: ", locale);
  const allPosts = await getAllPostsWithSlug((locale = "en-us"));
  return {
    paths: allPosts?.map(({ node }) => `/posts/${node._meta.uid}`) || [],
    fallback: true,
  };
}
