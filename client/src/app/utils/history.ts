import type { NavigateFunction, Location, To } from 'react-router-dom';
let navigate: NavigateFunction;
const history = {
  location: { state: null } as Location,
  bind(fn: NavigateFunction, location: Location) { navigate = fn; history.location = location; },
  push(to: To) { navigate(to); },
  replace(to: To) { navigate(to, { replace: true }); },
  goBack() { navigate(-1); },
};
export default history;
