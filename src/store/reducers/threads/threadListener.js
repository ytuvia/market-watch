import { Amplify } from 'aws-amplify';
import amplifyconfig from 'amplifyconfiguration.json';
import { onUpdateEntityThread } from 'graphql/subscriptions';
import { generateClient } from 'aws-amplify/api';
import { sendUpdateThreadStatus } from './threadsSlice';
Amplify.configure(amplifyconfig);

export default class ThreadListener {
    constructor(store) {
      this.store = store;
      const client = generateClient();
      // Subscribe to update of Todo
      this.updateSub = client
        .graphql({ query: onUpdateEntityThread })
        .subscribe({
          next: async ({data}) => {
            const thread = data.onUpdateEntityThread
            const thread_id = thread.id;
            const thread_status = thread.status;
            await store.dispatch(sendUpdateThreadStatus({
              thread_id: thread_id,
              thread_status: thread_status
            }))
          },
          error: (error) => console.warn(error)
      });
    }
}