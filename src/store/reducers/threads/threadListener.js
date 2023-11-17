import { onUpdateEntityThread } from '../../../graphql/subscriptions';
import { API } from 'aws-amplify';

export default class ThreadListener {
    constructor(store) {
      this.store = store;
      
      this.updateSub = API.graphql({ query: onUpdateEntityThread }).subscribe({
        next: ({ provider, value }) => {
          console.log('---listener---');
          console.log({ provider, value });

        },
        error: (error) => console.warn(error)
      });
    }


  }