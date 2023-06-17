import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Incoming revalidation request with query ${JSON.stringify(req.query, null, 0)}`);

  // Check for secret to confirm this is a legitime request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Check for business id to confirm the request is properly formatted
  if (!req.query.business_id) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    await res.revalidate(`/${req.query.business_id}`);
    await res.revalidate(`/${req.query.business_id}/cart`);

    return res.json({ revalidated: true });
  } catch (error: any) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page

    // TODO: Email Devs to see whats going on.
    return res
      .status(500)
      .send(`Error during revalidation if ${req.query.business_id}: ${error.message}`);
  }
}
