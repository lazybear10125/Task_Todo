export default function TaskList({
  columns = [],
  groups = [],
  tasks = [],
  changeStatus,
  onStatusChange,
  onAddTask,
  onDeleteGroup,
  deleteGroup,
  onDeleteTask,
  onEditTask,
}) {
  const handleStatusChange = onStatusChange || changeStatus;
  const handleDeleteGroup = onDeleteGroup || deleteGroup;
  // onStatusChange neu co gia tri thi se lay luon
  // neu onStatusChange khong co gia tri tra ve undifined, roi sang kiem tra gia tri cua changeStatus  co thi no lay, khong thi handleStatusChange tra ve undifined
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
    <div
      className="
        flex-1
        w-full min-w-0
        grid grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-4 lg:gap-5
        p-3 sm:p-4 lg:p-6
        items-start
        overflow-x-hidden
        "
    >
      {displayColumns.map(function (column) {
        return (
          <div
            key={column.id}
            className="   bg-[#f8fafc]
                          w-full min-w-0 max-w-full
                          border border-[#e2e8f0]
                          rounded-[12px] p-4
                          flex flex-col"
                          >
            <div className="flex justify-between items-center pb-3">
              <div className="flex items-center gap-2">
                <h3 className="m-0 text-base font-bold text-[#1e293b]">
                  {column.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="bg-[#eff6ff] hover:bg-[#dbeafe] text-black border-0 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer"
                  onClick={function () {
                    if (onAddTask) {
                      onAddTask(column.id);
                    }
                  }}
                >
                  + Add
                </button>

                {handleDeleteGroup && (
                  <button
                    type="button"
                    className="bg-[#eff6ff] hover:bg-[#fee2e2] text-[#ff0c30] border-0 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer"
                    onClick={function () {
                      handleDeleteGroup(column.id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-3.5 min-h-[80px] w-full min-w-0">
              {!column.tasks || column.tasks.length === 0 ? (
                <div className="text-center text-[#94a3b8] text-[13px] py-6 px-2 border border-dashed border-[#cbd5e1] rounded-lg">
                  No Problem
                </div>
              ) : (
                column.tasks.map(function (task) {
                  return (
                    <div
                      key={task.id}
                      className=" border-0 rounded-lg
                                  px-[5px] py-[10px]
                                  flex flex-col gap-[15px]
                                  bg-[#e2ebf6]
                                  w-full min-w-0 max-w-full">
                      <div className="flex flex-wrap justify-between items-start gap-2 min-w-0 w-full">
                        <h4 className="m-0 min-w-0 flex-1 text-sm font-semibold text-[#0f172a] [overflow-wrap:anywhere]">
                          {task.title}
                        </h4>
                        {onDeleteTask && (
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              type="button"
                              className="bg-[#eff6ff] text-[#2563eb] hover:underline px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer"
                              onClick={function () {
                                if (onEditTask) {
                                  onEditTask(task);
                                }
                              }}
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              className="bg-[#eff6ff] text-[#ff0c30] hover:underline px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer"
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
                        <p className="  w-full min-w-0 max-w-full
                                        m-0 text-[13px] text-[#475569]
                                        whitespace-pre-wrap
                                        [overflow-wrap:anywhere]">
                          {task.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center pt-1 text-xs">
                        <span className="text-[#64748b]">Status:</span>
                        <select
                          className="bg-[#f1f5f9] border border-[#cbd5e1] rounded-md px-2 py-[3px] text-xs text-[#334155] cursor-pointer outline-none"
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
