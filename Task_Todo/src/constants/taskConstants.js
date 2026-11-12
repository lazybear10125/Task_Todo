export const DEFAULT_DATA = [
  {
    id: 1,
    type: "todo",
    title: "To do",
    tasks: [
      { id: 1, groupId: 1, title: "Task1", description: "Des task 1" },
      { id: 2, groupId: 1, title: "Task2", description: "Des task 2" },
      { id: 3, groupId: 1, title: "Task3", description: "Des task 3" },
    ],
  },
  {
    id: 2,
    type: "improgress",
    title: "Improgress",
    tasks: [
      { id: 4, groupId: 2, title: "Task4", description: "Des task 4" },
      { id: 5, groupId: 2, title: "Task5", description: "Des task 5" },
      { id: 6, groupId: 2, title: "Task6", description: "Des task 6" },
    ],
  },
  {
    id: 3,
    type: "complete",
    title: "Complete",
    tasks: [
      { id: 7, groupId: 3, title: "Task7", description: "Des task 7" },
      { id: 8, groupId: 3, title: "Task8", description: "Des task 8" },
      { id: 9, groupId: 3, title: "Task9", description: "Des task 9" },
    ],
  },
];

export default DEFAULT_DATA;
