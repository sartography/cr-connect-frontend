export const mockFormlyFieldModel = {
  group_key: {
    first_field: 'First field value',
    second_field: 'Second field value',
    third_field: {
      third_field_a: true,
      third_field_other: true,
    },
    third_field_other: 'Third field other value',
    fourth_field: new Date(),
  }
};

export const mockFormlyFieldConfig = {
  key: 'group_key',
  defaultValue: 'Hello there.',
  fieldGroup: [
    {key: 'first_field', type: 'input', templateOptions: {label: 'First Field'}},
    {key: 'second_field', type: 'input', templateOptions: {label: 'Second Field'}},
    {
      key: 'third_field', type: 'multicheckbox', templateOptions: {
        label: 'Third Field',
        options: [
          {label: 'Option A', value: 'third_field_a'},
          {label: 'Option B', value: 'third_field_b'},
          {label: 'Option C', value: 'third_field_c'},
          {label: 'Other', value: 'third_field_other'},
        ]
      }
    },
    {key: 'third_field_other', type: 'input', templateOptions: {label: 'Third Field Other'}},
    {key: 'fourth_field', type: 'datepicker', templateOptions: {label: 'Fourth Field Date'}},
  ],
};
