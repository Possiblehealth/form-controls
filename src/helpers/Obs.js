/* eslint-disable new-cap */
import { Record, List } from 'immutable';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';

export const ImmutableObs = Record({
  concept: undefined,
  uuid: undefined,
  value: undefined,
  observationDateTime: undefined,
  voided: false,
  comment: undefined,
  formNamespace: undefined,
  formFieldPath: undefined,
  groupMembers: undefined,
});

const NUMERIC_DATATYPE = 'Numeric';
const ABNORMAL_CONCEPT_CLASS = 'Abnormal';

export class Obs extends ImmutableObs {
  getUuid() {
    return this.get('uuid');
  }

  getValue() {
    return this.get('value');
  }

  isDirty(value) {
    if (typeof (this.get('value')) === 'object') {
      return this.get('value').uuid !== value.uuid;
    }
    return this.get('value') !== value;
  }

  setValue(value) {
    if (this.isDirty(value)) {
      return this.set('observationDateTime', null).set('value', value).set('voided', false);
    }
    return this;
  }

  setComment(comment) {
    return this.set('comment', comment);
  }

  getComment() {
    return this.get('comment');
  }

  void() {
    return this.set('voided', true).set('value', undefined);
  }

  isVoided() {
    return this.get('voided');
  }

  getFormNamespace() {
    return this.get('formNamespace');
  }

  addGroupMember(obs) {
    let groupMembers = this.get('groupMembers');
    if (!groupMembers) {
      groupMembers = new List();
    }
    if (groupMembers.includes(obs)) {
      return this;
    }
    const index = groupMembers.findIndex(o => o.concept === obs.concept);

    if (index === -1) {
      return this.set('groupMembers', groupMembers.push(obs));
    }
    return this.setIn(['groupMembers', index], obs);
  }

  getGroupMembers() {
    return this.get('groupMembers');
  }

  removeGroupMembers() {
    return this.set('groupMembers', undefined);
  }

  isNumeric() {
    const concept = this.get('concept');
    if (concept &&
      (concept.datatype === NUMERIC_DATATYPE || concept.dataType === NUMERIC_DATATYPE)) {
      return true;
    }

    return false;
  }

  getAbnormalChildObs() {
    return this.get('groupMembers').find(o => o.concept.conceptClass === ABNORMAL_CONCEPT_CLASS);
  }

  getObject(obs) {
    return obs.toJS();
  }
}
/* eslint-disable new-cap */

export function obsFromMetadata(formNamespaceAndPath, metadata) {
  const { formNamespace, formFieldPath } = formNamespaceAndPath;
  return new Obs({
    concept: metadata.concept,
    formNamespace,
    formFieldPath,
    voided: true,
  });
}

export function createObsFromControl(formName, formVersion, control, bahmniObservations) {
  const formNamespaceAndPath = createFormNamespaceAndPath(formName, formVersion, control.id);
  const index = bahmniObservations.findIndex(observation =>
    observation.formFieldPath === formNamespaceAndPath.formFieldPath
  );

  if (index >= 0) {
    return new Obs(bahmniObservations[index]);
  }
  return obsFromMetadata(formNamespaceAndPath, control);
}
