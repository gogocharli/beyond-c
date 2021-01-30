import { createTransitions } from './transitions.js';
import { rateUser } from './rating.js';

createTransitions();

if (document.URL.includes('callback')) {
  rateUser();
}
