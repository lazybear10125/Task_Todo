import "./ui/TaskList.css";

export default function TaskList({ groups, tasks, changeStatus }) {
  return (
    <div className="task-board">
      {groups.map(function (group) {
        const tasksInGroup = tasks.filter(function (task) {
          if (task.groupId) {
            return task.groupId === group.id;
          }
          if (task.id === "1") {
            return group.id === "todo";
          }
          if (task.id === "2") {
            return group.id === "in-progress";
          }
          if (task.id === "3") {
            return group.id === "complete";
          }
          return task.status === group.id;
        });

        return (
          <div key={group.id} className="task-column">
            <div className="column-header">
              <div className="column-title-wrap">
                <h3 className="column-title">{group.title}</h3>
              </div>
              <button
                type="button"
                className="add-task-small-button"
              >
                + Add
              </button>
            </div>

            <div className="task-list">
              {tasksInGroup.length === 0 ? (
                <div className="empty-message">Chưa có công việc nào</div>
              ) : (
                tasksInGroup.map(function (task) {
                  return (
                    <div key={task.id} className="task-card">
                      <div className="task-header">
                        <h4 className="task-title">{task.title}</h4>
                      </div>

                      <p className="task-description">{task.description}</p>

                      <div className="task-status-row">
                        <span className="status-label">Trạng thái:</span>
                        <select
                          className="status-select"
                          value={task.status}
                          onChange={function (event) {
                            changeStatus(task.id, event.target.value);
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
