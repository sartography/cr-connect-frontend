import {BpmnFormJsonField} from '../_models/json';
import {ToFormlyPipe} from './to-formly.pipe';

describe('ToFormlyPipe', () => {
  const pipe = new ToFormlyPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('converts string field to Formly input field', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'full_name',
        label: 'What is your quest?',
        type: 'string',
        defaultValue: 'I seek the Holy Grail!',
        properties: [
          {
            id: 'hide_expression',
            value: 'model.full_name !== "Arthur, King of the Britons"'
          },
          {
            id: 'required_expression',
            value: 'model.favorite_color !== "blue" || model.favorite_color !== "yellow"'
          },
          {
            id: 'description',
            value: 'The quest for the Grail is not archaeology; it\'s a race against evil!'
          }
        ]
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('input');
    expect(after[0].defaultValue).toEqual(before[0].defaultValue);
    expect(after[0].templateOptions.label).toEqual(before[0].label);
    expect(after[0].hideExpression).toEqual(before[0].properties[0].value);
    expect(after[0].expressionProperties['templateOptions.required']).toEqual(before[0].properties[1].value);
  });

  it('converts boolean field to Formly radio group', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'should_ask_color',
        label: 'Does color affect your mood?',
        type: 'boolean',
        defaultValue: 'false',
        validation: [
          {
            name: 'required',
            config: 'true'
          }
        ],
        properties: [
          {
            id: 'help',
            value: 'help text goes here'
          }
        ]
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('radio');
    expect(after[0].defaultValue).toEqual(false);
    expect(after[0].templateOptions.label).toEqual(before[0].label);
    expect(after[0].templateOptions.required).toEqual(true);
    expect(after[0].templateOptions.options[0].value).toEqual(true);
    expect(after[0].templateOptions.options[0].label).toEqual('Yes');
    expect(after[0].templateOptions.help).toEqual(before[0].properties[0].value);
  });

  it('converts enum fields to various Formly array fields', async () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'favorite_color',
        label: 'What is your favorite color?',
        type: 'enum',
        defaultValue: 'red',
        options: [
          {id: 'red', name: 'Red'},
          {id: 'green', name: 'Green'},
          {id: 'blue', name: 'Blue'},
        ],
        validation: [
          {
            name: 'required',
            config: 'false'
          }
        ],
        properties: [
          {
            id: 'help',
            value: 'help text goes here'
          }
        ]
      }
    ];
    const after = await pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('select');
    expect(after[0].defaultValue).toEqual('red');
    expect(after[0].templateOptions.label).toEqual(before[0].label);
    expect(after[0].templateOptions.required).toEqual(false);

    // Stupid hack to check length of options array because its
    // type is any[] | Observable<any[]>
    let numOptions = 0;
    await after[0].templateOptions.options.forEach(() => numOptions++);
    expect(numOptions).toEqual(before[0].options.length);

    expect(after[0].templateOptions.options[0].value).toEqual('red');
    expect(after[0].templateOptions.options[0].label).toEqual('Red');
    expect(after[0].templateOptions.help).toEqual(before[0].properties[0].value);

    before[0].properties.push({id: 'enum_type', value: 'checkbox'});
    const afterMulticheckbox = await pipe.transform(before);
    expect(afterMulticheckbox[0].type).toEqual('multicheckbox');
    expect(afterMulticheckbox[0].className).toEqual('vertical-checkbox-group');

    before[0].properties[1] = {id: 'enum_type', value: 'radio'};
    const afterRadio = await pipe.transform(before);
    expect(afterRadio[0].type).toEqual('radio');
    expect(afterRadio[0].className).toEqual('vertical-radio-group');
  });

  it('converts date field to Formly date field', async () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'pb_time',
        label: 'What time is it?',
        type: 'date',
        defaultValue: '1955-11-12T22:04:12.345Z'
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('date');

    const afterDate = await after[0].defaultValue;
    expect(afterDate.toISOString()).toEqual(before[0].defaultValue);
    expect(after[0].templateOptions.label).toEqual(before[0].label);
  });

  it('converts long field to Formly number field', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'random_number',
        label: 'Pick a number. Any number',
        type: 'long'
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('input');
    expect(after[0].templateOptions.type).toEqual('number');
    expect(after[0].templateOptions.label).toEqual(before[0].label);
  });

  it('converts file field to Formly file field', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'upload_file',
        label: 'TPS Report',
        type: 'file'
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('file');
    expect(after[0].templateOptions.label).toEqual(before[0].label);
  });

});
