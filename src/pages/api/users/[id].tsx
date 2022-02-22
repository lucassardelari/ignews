import { NextApiRequest, NextApiResponse } from "next"


export default (request: NextApiRequest, response: NextApiResponse) => {
    const id = request.query;
    
    const users = [
        { id: 1, name: 'Lucas'},
        { id: 2, name: 'Lari'},
        { id: 3, name: 'Rafa'},
    ]

    return response.json(users);
}