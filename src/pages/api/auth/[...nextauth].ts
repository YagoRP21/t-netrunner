import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { query as q } from 'faunadb'
import { fauna } from "../../../services/fauna"

export const authOptions = {
  
    providers: [
     GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        // @ts-ignore
        scope: 'read:user',
      }),
    ],
    callbacks: {
      async session(session:any) {
        try {
          const userActiveSubscription = await fauna.query(
            q.Get(
              q.Intersection([
                q.Match(
                  q.Index('subscription_by_user_ref'),
                  q.Select(
                    "ref",
                    q.Get(
                      q.Match(
                        q.Index('user_by_email'),
                        q.Casefold(session.session.user.email)
                      )
                    )
                  )
                ),
                q.Match(
                  q.Index('subscription_by_status'),
                  "active"
                )
              ])
            )
          )
    
          return {
            ...session,
            activeSubscription: userActiveSubscription
          }
        } catch {
          return {
            ...session,
            activeSubscription: null,
          }
        }
      },
      
      
      
      async signIn(user:any, account:any, profile:any) {
        
        const { email } = user.user
        
        try {
          await fauna.query(
            q.If(
              q.Not(
                q.Exists(
                  q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(user.user.email)
                  )
                )
              ),
              q.Create(
                q.Collection('users'),
                { data: { email }}
              ),
              q.Get(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.user.email)
                )
              )
            )
          )
          return true
        } catch {
          return false
        }
      },


    },
    secret: process.env.NEXTAUTH_SECRET,
    jwt:{
      signingKey: process.env.JWT_SECRET
    },
    
}

// @ts-ignore
export default NextAuth(authOptions)