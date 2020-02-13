import {Pipe, PipeTransform} from '@angular/core';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {isIterable} from 'rxjs/internal-compatibility';
import {BpmnFormJsonField} from 'sartography-workflow-lib';
import {EmailValidator, PhoneValidator} from '../_forms/validators/formly.validator';

/***
 * Convert the given BPMN form JSON value to Formly JSON
 * Usage:
 *  value | toFormly
 *
 * Example:
 jsonValue = {
      field: [
        {
          id: 'should_ask_color',
          label: 'Does color affect your mood?',
          type: 'boolean',
          defaultValue: 'false',
          validation: [
            {name: 'required', config: 'true'}
          ]
        },
        {
          id: 'favorite_color',
          label: 'What is your favorite color?',
          type: 'enum',
          defaultValue: 'indigo',
          value: [
            {id: 'red', name: 'Red'},
            {id: 'orange', name: 'Orange'},
            ...
            {id: 'violet', name: 'Violet'},
            {id: 'other', name: 'Other'},
          ],
          properties: [
            {id: 'hide_expression', value: '!should_ask_color'},
            {id: 'description', value: '...'},
            {id: 'help', value: '...'},
          ]
        },
        {
          id: 'other_color',
          label: 'Enter other color',
          type: 'text',
          properties: [
            {id: 'hide_expression', value: '!(should_ask_color && (favorite_color === "other"))'},
            {id: 'required_expression', value: 'should_ask_color && (favorite_color === "other")'},
          ]
        }
      ]
    }

 {{ jsonValue | toFormly }}

 Outputs: {
      fields: [
        {
          key: 'should_ask_color',
          type: 'boolean',
          defaultValue: 'false',
          templateOptions: {
            label: 'Does color affect your mood?',
          },
        },
        {
          key: 'favorite_color',
          type: 'select',
          templateOptions: {
            label: 'What is your favorite color?',
            options: [
              {value: 'red', label: 'Red'},
              {value: 'orange', label: 'Orange'},
              ...
              {value: 'violet', label: 'Violet'},
              {value: 'other', label: 'Other'}
            ],
            hideExpression: '!(should_ask_color && (favorite_color === "other"))'
          },
        },
        {
          key: 'other_color',
          type: 'text',
          templateOptions: {
            label: 'Enter other color',
            hideExpression: '!(should_ask_color && (favorite_color === "other"))'
          }
          expressionProperties: {
            'templateOptions.required': 'should_ask_color && (favorite_color === "other")'
          }
        }
      ]
    }
 */
@Pipe({
  name: 'toFormly'
})
export class ToFormlyPipe implements PipeTransform {

  transform(value: BpmnFormJsonField[], ...args: any[]): FormlyFieldConfig[] {
    const result: FormlyFieldConfig[] = [];
    for (const field of value) {
      const resultField: FormlyFieldConfig = {
        key: field.id,
        templateOptions: {},
        expressionProperties: {}
      };

      switch (field.type) {
        case 'enum':
          resultField.type = 'select';
          resultField.defaultValue = field.defaultValue;
          resultField.templateOptions.options = field.options.map(v => {
            return {value: v.id, label: v.name};
          });
          break;
        case 'string':
          resultField.type = 'input';
          resultField.defaultValue = field.defaultValue;
          break;
        case 'textarea':
          resultField.type = 'textarea';
          resultField.defaultValue = field.defaultValue;
          break;
        case 'long':
          resultField.type = 'input';
          resultField.templateOptions.type = 'number';
          resultField.defaultValue = parseInt(field.defaultValue, 10);
          break;
        case 'url':
          resultField.type = 'input';
          resultField.templateOptions.type = 'url';
          resultField.defaultValue = field.defaultValue;
          resultField.validators = {validation: ['url']};
          break;
        case 'email':
          resultField.type = 'input';
          resultField.templateOptions.type = 'email';
          resultField.defaultValue = field.defaultValue;
          resultField.validators = {validation: ['email']};
          break;
        case 'tel':
          resultField.type = 'input';
          resultField.templateOptions.type = 'tel';
          resultField.defaultValue = field.defaultValue;
          resultField.validators = {validation: ['phone']};
          break;
        case 'boolean':
          resultField.type = 'radio';
          if (field.defaultValue !== undefined && field.defaultValue !== null && field.defaultValue !== '') {
            resultField.defaultValue = this._stringToBool(field.defaultValue);
          }
          resultField.templateOptions.options = [
            {value: true, label: 'Yes'},
            {value: false, label: 'No'},
          ];
          break;
        case 'date':
          resultField.type = 'date';
          if (field.defaultValue) {
            resultField.defaultValue = new Date(field.defaultValue);
          }
          break;
        case 'files':
          resultField.type = 'files';
          break;
        case 'file':
          resultField.type = 'file';
          break;
        default:
          console.error('Field type is not supported.');
          resultField.type = field.type;
          break;
      }

      resultField.templateOptions.label = field.label;

      if (field.validation && isIterable(field.validation) && (field.validation.length > 0)) {
        for (const v of field.validation) {
          if (v.name === 'required') {
            resultField.templateOptions.required = this._stringToBool(v.config);
          }
        }
      }

      if (field.properties && isIterable(field.properties) && (field.properties.length > 0)) {
        for (const p of field.properties) {
          switch (p.id) {
            case 'hide_expression':
              resultField.hideExpression = p.value;
              break;
            case 'label_expression':
              resultField.expressionProperties['templateOptions.label'] = p.value;
              break;
            case 'required_expression':
              resultField.expressionProperties['templateOptions.required'] = p.value;
              break;
            case 'placeholder':
              resultField.templateOptions.placeholder = p.value;
              break;
            case 'description':
              resultField.templateOptions.description = p.value;
              break;
            case 'help':
              resultField.templateOptions.help = p.value;
              break;
            case 'autosize':
              resultField.templateOptions.autosize = this._stringToBool(p.value);
              break;
            case 'rows':
              resultField.templateOptions.rows = parseInt(p.value, 10);
              break;
            case 'cols':
              resultField.templateOptions.cols = parseInt(p.value, 10);
              break;
            case 'enum_type':
              if (field.type === 'enum') {
                if (p.value === 'checkbox') {
                  resultField.type = 'multicheckbox';
                  resultField.className = 'vertical-checkbox-group';
                  if (resultField.templateOptions.required) {
                    resultField.validators = {validation: ['multicheckbox']};
                  }
                }

                if (p.value === 'radio') {
                  resultField.type = 'radio';
                  resultField.className = 'vertical-radio-group';
                }

                resultField.templateOptions.options = field.options.map(v => {
                  return {value: v.id, label: v.name};
                });
              }
              break;
            default:
              break;
          }
        }
      }

      result.push(resultField);
    }

    return result;
  }

  private _stringToBool(s: string) {
    return s.toLowerCase() === 'true';
  }

}
