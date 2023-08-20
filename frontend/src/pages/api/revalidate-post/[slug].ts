// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
 const secret = req.query.secret;

 if(!secret || secret !== process.env.POST_REVALIDATION_KEY) {
   return res.status(401).json({error: "invalid revalidation key"});
 }

 try {
    await res.revalidate("/blog/"+req.query.slug);
    res.status(200).json({message: "revalidation successfull"});
 } catch (error) {
  res.status(500).json({error:"error in validation"});
 }
}
