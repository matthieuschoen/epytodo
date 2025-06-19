const GetFromUserId = "SELECT * FROM user WHERE id = ?";
const GetFromTodosByUserId = "SELECT * FROM todo WHERE user_id = ?";
const GetFromUserEmail = "SELECT * FROM user WHERE email = ?";
const UpdateUserById = (fields) => `UPDATE user SET ${fields} WHERE id = ?`;
const DeleteFromUserId = "DELETE FROM user WHERE id = ?";
const DeleteTodoFromUserId = "DELETE FROM todo WHERE user_id = ?";

module.exports = {
    GetFromUserId,
    GetFromTodosByUserId,
    GetFromUserEmail,
    UpdateUserById,
    DeleteFromUserId,
    DeleteTodoFromUserId
};
