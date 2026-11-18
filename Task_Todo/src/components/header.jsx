import Button from "./button/button";

export default function Header({
  newGroupTitle,
  onNewGroupTitleChange,
  onAddGroup,
  onDeleteGroupByName,
  onOpenAddTask,
}) {
  function handleInputChange(e) {
    onNewGroupTitleChange(e.target.value);
  }

  return (
    <header className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex justify-between items-center flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <h1 className="m-0 text-[20px] font-bold text-[#0f172a]">Todo Task</h1>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <form className="flex items-center gap-2" onSubmit={onAddGroup}>
          <input
            type="text"
            placeholder="Enter NameGroup News..."
            className="border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm outline-none w-45 focus:border-[#2563eb]"
            value={newGroupTitle}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            variant="add"
            className="bg-[#4a5b6d] hover:bg-[#005cd5] text-[#060707] border border-[#cbd5e1]"
          >
            + Add Group
          </Button>
          <Button type="button" variant="delete" onClick={onDeleteGroupByName}>
            - Delete Group
          </Button>
        </form>

        <Button
          type="button"
          variant="add"
          className="px-4"
          onClick={() => {
            console.log("+AddTask");
            onOpenAddTask();
          }}
        >
          + Add Task
        </Button>
      </div>
    </header>
  );
}
