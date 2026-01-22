import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { RouterClient } from '@orpc/server';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import type router from './_router';

const link = new RPCLink({
  url: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/rpc`,
  headers: async () => {
    if (typeof window !== 'undefined') {
      return {};
    }

    const { headers } = await import('next/headers');
    return await headers();
  },
});

const client = createORPCClient(link) satisfies RouterClient<typeof router>;
const orpc = createTanstackQueryUtils(client);

export default orpc;
