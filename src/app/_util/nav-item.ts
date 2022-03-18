import {
  NavItemType,
  WorkflowNavItem,
  WorkflowState,
  WorkflowMetadata,
  WorkflowTaskState,
  WorkflowCategoryMetadata
} from 'sartography-workflow-lib';

// Decides which categories and workflows to display
export const shouldDisplayItem= (listItem: WorkflowMetadata|WorkflowCategoryMetadata): boolean => {
  const hideTypes = [
    // removed disabled state per Alex - we need to display them and show them as being disabled instead.
    WorkflowState.HIDDEN,
  ];
  return (
    listItem &&
    listItem.state &&
    !hideTypes.includes(<WorkflowState>listItem.state)
  );
};

const userTypes = [
  NavItemType.USER_TASK,
  NavItemType.MANUAL_TASK,
];

export const shouldDisplayNavItem = (navItem: WorkflowNavItem): boolean => (
      navItem &&
      isOrContainsUserTasks(navItem)
  );

export const isOrContainsUserTasks = (navItem: WorkflowNavItem): boolean => {
  if (userTypes.includes(navItem.spec_type)) {
    return true;
  }
  for (const child of navItem.children || []) {
    if (isOrContainsUserTasks(child)) {
      return true;
    }
  }
  return false;
};

export const shouldDisableNavItem = (navItem: WorkflowNavItem): boolean => {
  const disableTypes = [
    WorkflowTaskState.MAYBE,
    WorkflowTaskState.LIKELY,
    WorkflowTaskState.FUTURE
  ];
  return (disableTypes.includes(navItem.state) || navItem.spec_type !== NavItemType.USER_TASK)
};
