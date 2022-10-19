import * as Prismic from '@prismicio/client';

export const apiEndpoint = process.env.PRISMIC_ENDPOINT;
export const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

export const PrismicClient = (req = null) => (
    //@ts-ignore
    Prismic.createClient(apiEndpoint, {
    req,
    accessToken
  })
);