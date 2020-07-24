import {
  WorkflowNavItem,
  WorkflowState,
  WorkflowStats,
  WorkflowTaskState,
  WorkflowTaskType
} from 'sartography-workflow-lib';


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

export const shouldDisplayNavItem = (navItem: WorkflowNavItem): boolean => {
  const hideTypes = [
    WorkflowTaskType.SCRIPT_TASK,
    WorkflowTaskType.BUSINESS_RULE_TASK,
    WorkflowTaskType.NONE_TASK,
  ];
  return (
    navItem &&
    navItem.task &&
    navItem.task.type &&
    !hideTypes.includes(navItem.task.type)
  );
};


export const shouldDisableNavItem = (navItem: WorkflowNavItem): boolean => {
  const disableTypes = [
    WorkflowTaskState.MAYBE,
    WorkflowTaskState.LIKELY,
    WorkflowTaskState.FUTURE
  ];
  return (disableTypes.includes(navItem.state) || !navItem.task_id)
}
