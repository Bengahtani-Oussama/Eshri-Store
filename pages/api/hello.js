// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import db from '@/utils/DB/db';

const handler = async (req, res) => {
  await db.connect();
  await db.disconnect();
  res.status(200).json({ name: 'John Doe' });
};
export default handler;
