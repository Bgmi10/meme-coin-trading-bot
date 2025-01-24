import axios from "axios";
require("dotenv").config();

const TweetTime = 60 * 60 * 60 * 1000;

export default async function getTweets(username: string) {
    const options = {
        method: 'GET',
        url: 'https://twitter154.p.rapidapi.com/user/tweets',
        params: {
            username: username,
            limit: '100',
        },
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY,
          'x-rapidapi-host': 'twitter154.p.rapidapi.com'
        }
      };      

    try {
        const response: any = await axios.request(options);
        const data = await response.data.results.map((item: any) => ({
            content: item.text,
            id: item.user.user_id,
            createdAt: item.creation_date
        }))
        return data.filter((item: any) => new Date(item.createdAt).getTime() > Date.now() - TweetTime); 
    } catch (e) {
        console.log(e);
    }
}