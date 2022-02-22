import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: { params: { scope: 'read:user' }}
    }),
  ],
})

// FaunaDB - Melhor banco para se utilizar com Serveless
// Banco Relacional, orientado a Documento
// HTTP - nao precisam manter um pull de conexao em aberto
// 1000 autenticacao ()
// DynamoDB - AWS


// PostgreeSQL, MongoDB - Criar uma nova conexao com o banco quando uma funcao serveless for chamado, isso é custoso.
// 24h (1 conexao)
