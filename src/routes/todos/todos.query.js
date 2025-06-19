const InsertIntoTable = "INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)";
const SelectFromId = "SELECT * FROM todo WHERE id = ?";
const DeleteFromTodoId = "DELETE FROM todo WHERE id = ?";
const SelectFromTodo = "SELECT * FROM todo";
const UpdateFromId = "UPDATE todo SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE id = ?";

module.exports = {
    InsertIntoTable,
    SelectFromId,
    DeleteFromTodoId,
    SelectFromTodo,
    UpdateFromId,
};
