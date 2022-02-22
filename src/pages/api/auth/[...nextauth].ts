import { query as q } from 'faunadb'
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: { params: { scope: 'read:user' }}
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const userEmail = user.email;
      
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(userEmail)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email: userEmail } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(userEmail)
              )
            )
          ),          
        );
        
        return true;
      } catch {
        return false;
      }
    },
  }
})

// FaunaDB - Melhor banco para se utilizar com Serveless
// Banco Relacional, orientado a Documento
// HTTP - nao precisam manter um pull de conexao em aberto
// 1000 autenticacao ()
// DynamoDB - AWS


// PostgreeSQL, MongoDB - Criar uma nova conexao com o banco quando uma funcao serveless for chamado, isso é custoso.
// 24h (1 conexao)
