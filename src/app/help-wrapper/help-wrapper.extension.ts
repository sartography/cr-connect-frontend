import {FormlyFieldConfig} from '@ngx-formly/core';

export function helpWrapperExtension(field: FormlyFieldConfig) {
  if (!field.templateOptions || (field.wrappers && field.wrappers.indexOf('help') !== -1)) {
    return;
  }

  if (field.templateOptions.help) {
    console.log('field.templateOptions.help', field.templateOptions.help);
    console.log('field.wrappers before', field.wrappers);
    field.wrappers = [...(field.wrappers || []), 'help'];
    console.log('field.wrappers after', field.wrappers);
  }
}
