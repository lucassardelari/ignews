import { NextApiRequest, NextApiResponse } from "next"


export default (request: NextApiRequest, response: NextApiResponse) => {
    //exemplo: quando for fazer integraçao com terceiro
    //e o usuario precisa digitar mais coisas
    //http://localhost:3000/api/users/edit/1/banana
    //o params vem em array ['edit', '1', 'banana']
    
    const params = request.query;
    
    const users = [
        { id: 1, name: 'Lucas'},
        { id: 2, name: 'Lari'},
        { id: 3, name: 'Rafa'},
    ]

    return response.json(users);
}