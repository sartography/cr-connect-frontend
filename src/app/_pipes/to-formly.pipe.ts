import {Pipe, PipeTransform} from '@angular/core';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {isIterable} from 'rxjs/internal-compatibility';
import {BpmnFormJsonField} from '../_models/json';

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

      if (field.type === 'enum') {
        resultField.type = 'select';
        resultField.defaultValue = field.defaultValue;
        resultField.templateOptions.options = field.value.map(o => {
          return {value: o.id, label: o.name};
        });
      } else if (field.type === 'string') {
        resultField.type = 'input';
        resultField.defaultValue = field.defaultValue;
      } else if (field.type === 'long') {
        resultField.type = 'number';
        resultField.defaultValue = parseInt(field.defaultValue, 10);
      } else if (field.type === 'boolean') {
        resultField.type = 'radio';
        resultField.templateOptions.options = [
          {value: true, label: 'Yes'},
          {value: false, label: 'No'},
        ];
      } else if (field.type === 'date') {
        resultField.type = 'date';
        if (field.defaultValue) {
          resultField.defaultValue = new Date(field.defaultValue);
        }
      } else if (field.type === 'file') {
        resultField.type = 'file';
      }

      resultField.templateOptions.label = field.label;

      if (field.validation && isIterable(field.validation) && (field.validation.length > 0)) {
        for (const v of field.validation) {
          if (v.name === 'required') {
            resultField.templateOptions.required = v.config.toLowerCase() === 'true';
          }
        }
      }

      if (field.properties && isIterable(field.properties) && (field.properties.length > 0)) {
        for (const p of field.properties) {
          if (p.id === 'hide_expression') {
            resultField.hideExpression = p.value;
          } else if (p.id === 'required_expression') {
            resultField.expressionProperties['templateOptions.required'] = p.value;
          } else if (p.id === 'description') {
            resultField.templateOptions.description = p.value;
          } else if (p.id === 'help') {
            resultField.templateOptions.help = p.value;
          }
        }
      }

      result.push(resultField);
    }

    return result;
  }

}
