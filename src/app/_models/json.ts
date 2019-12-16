export interface BpmnFormJsonFieldValidationConstraint {
  name: string;
  config: string;
}

export interface BpmnFormJsonFieldProperty {
  id: string;
  value: string;
}

export interface BpmnFormJsonFieldEnumValue {
  id: string;
  name: string;
}

export interface BpmnFormJsonField {
  id: string;
  label: string;
  type: string;
  defaultValue?: string;
  validation?: BpmnFormJsonFieldValidationConstraint[];
  properties?: BpmnFormJsonFieldProperty[];
  value?: BpmnFormJsonFieldEnumValue[];
}
