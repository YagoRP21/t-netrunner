import * as prismic from '@prismicio/client'




export const repositoryName = process.env.PRISMIC_ENDPOINT

//@ts-ignore
export const client = prismic.createClient(repositoryName, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    
})