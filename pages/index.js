import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getAllPostsForHome, getAllPostsForHomeSlovene } from "../lib/api";
import Head from "next/head";
import { CMS_NAME } from "../lib/constants";

import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Index({ preview, allPosts, allPostsSlovene }) {
  const router = useRouter();
  // console.log(router.locale);

  // Get the either English or Slovene post based on the locale
  let locale = router.locale;
  const heroPost = locale === "en" ? allPosts[0].node : allPostsSlovene[0].node;
  const morePosts =
    locale === "en" ? allPosts.slice(1) : allPostsSlovene.slice(1);

  const { t } = useTranslation("common");

  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <Container>
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
          <Link href="/" locale="en">
            <a>English</a>
          </Link>
          <br />
          <Link href="/" locale="sl">
            <a>Slovene</a>
          </Link>
          <Intro />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverimage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost._meta.uid}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps({ preview = false, previewData }) {
  // Create two seperate queries for each of the available locales (english and slovene)
  const allPosts = await getAllPostsForHome(previewData);
  const allPostsSlovene = await getAllPostsForHomeSlovene(previewData);
  return {
    props: { preview, allPosts, allPostsSlovene },
  };
}
