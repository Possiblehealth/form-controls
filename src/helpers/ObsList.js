/* eslint-disable new-cap */
import { Record, List } from 'immutable';

export const ImmutableObsList = Record({
  formFieldPath: undefined,
  obs: undefined,
  obsList: new List(),
});

export class ObsList extends ImmutableObsList {

  cloneForAddMore(formFieldPath) {
    return new ObsList({
      obs: this.get('obs').set('formFieldPath', formFieldPath),
      formNamespace: this.get('formNamespace'),
      obsList: new List(),
      formFieldPath,
    });
  }

  void() {
    const voidedObsList = this.obsList.map(obs => obs.void());
    return this.set('obsList', voidedObsList);
  }

  getObsList() {
    return this.get('obsList');
  }

  getObs() {
    return this.get('obs');
  }

  setObsList(obsList) {
    return this.set('obsList', obsList);
  }

}
/* eslint-disable new-cap */
