import { NextApiRequest, NextApiResponse } from "next"

// --Autenticação--
// JWT (Storage)
// Next Auth (Login Social (Facebook, Github, Google)) -- nao se preucupar em armazenar credenciais dentro do backend
// Cognito, Auth0

export default (request: NextApiRequest, response: NextApiResponse) => {
    const users = [
        { id: 1, name: 'Lucas'},
        { id: 2, name: 'Lari'},
        { id: 3, name: 'Rafa'},
    ]

    return response.json(users);
}

// Serverless
// As rotas executam quando necessitam dos dados da requisicao
// Entao quando voce solicita, ele sobe um "servidor" executa a funcao
// depois que enviou a resposta, ele derruba o "servidor"