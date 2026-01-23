import crypto from 'node:crypto';
import { redirect } from 'next/navigation';

const Page = () => {
  const roomId = crypto.randomUUID();
  redirect(`/game/room/${roomId}/lobby`);
};

export default Page;
