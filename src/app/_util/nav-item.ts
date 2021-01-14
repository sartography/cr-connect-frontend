import {NavItemType, WorkflowNavItem, WorkflowState, WorkflowStats, WorkflowTaskState} from 'sartography-workflow-lib';


export const shouldDisplayWorkflow = (workflowListItem: WorkflowStats): boolean => {
  const hideTypes = [
    WorkflowState.DISABLED,
    WorkflowState.HIDDEN,
  ];
  return (
    workflowListItem &&
    workflowListItem.state &&
    !hideTypes.includes(workflowListItem.state)
  );
}

const groupTypes = [
  NavItemType.SEQUENCE_FLOW,
  NavItemType.EXCLUSIVE_GATEWAY,
  NavItemType.PARALLEL_GATEWAY,
  NavItemType.CALL_ACTIVITY,
]
const userTypes = [
  NavItemType.USER_TASK,
  NavItemType.MANUAL_TASK,
];

export const shouldDisplayNavItem = (navItem: WorkflowNavItem): boolean => {
  return (
      navItem &&
      isOrContainsUserTasks(navItem)
  );
};

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
}
