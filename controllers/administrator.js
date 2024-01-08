// import { users } from "../models/models.js";

export const administrator = async (request, response) => {
  const { reftoken } = request.cookies;
  if (!reftoken) return response.status(403).json('only admin can access!');
  const admin = await users.findOne({ where: { reftoken } });
  if (!admin) return response.status(404).json('only admin can access!');
  if (admin.email !== process.env.admin_email) return response.status(403).json('only admin can access!');
  response.status(200).json(admin.username);
};
