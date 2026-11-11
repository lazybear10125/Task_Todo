import "./ui/TaskList.css";

export default function TaskList({
  columns = [],
  groups = [],
  tasks = [],
  changeStatus,
  onStatusChange,
  onAddTask,
  onDeleteTask,
}) {
  const handleStatusChange = onStatusChange || changeStatus;

  const displayColumns =
    columns && columns.length > 0
      ? columns
      : groups.map(function (group) {
          const tasksInGroup = (tasks || []).filter(function (task) {
            return (task.groupId || task.status) === group.id;
          });
          return {
            id: group.id,
            title: group.title,
            tasks: tasksInGroup,
          };
        });

  return (
    <div className="task-board">
      {displayColumns.map(function (column) {
        return (
          <div key={column.id} className="task-column">
            <div className="column-header">
              <div className="column-title-wrap">
                <h3 className="column-title">{column.title}</h3>
              </div>
              <button
                type="button"
                className="add-task-small-button"
                onClick={function () {
                  if (onAddTask) {
                    onAddTask(column.id);
                  }
                }}
              >
                + Add
              </button>
            </div>

            <div className="task-list">
              {!column.tasks || column.tasks.length === 0 ? (
                <div className="empty-message">Chưa có công việc nào</div>
              ) : (
                column.tasks.map(function (task) {
                  return (
                    <div key={task.id} className="task-card">
                      <div className="task-header">
                        <h4 className="task-title">{task.title}</h4>
                        {onDeleteTask && (
                          <div className="task-actions">
                            <button
                              type="button"
                              className="delete-button"
                              onClick={function () {
                                onDeleteTask(task.id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}

                      <div className="task-status-row">
                        <span className="status-label">Trạng thái:</span>
                        <select
                          className="status-select"
                          value={task.status || column.id}
                          onChange={function (event) {
                            if (handleStatusChange) {
                              handleStatusChange(task.id, event.target.value);
                            }
                          }}
                        >
                          {groups.map(function (item) {
                            return (
                              <option key={item.id} value={item.id}>
                                {item.title}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
