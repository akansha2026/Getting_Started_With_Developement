import { UserDatabase } from "../db/user.db.js";
import { StatusCodes } from "http-status-codes";
import { getToken } from "../utils/token.utlis.js";
const userDb = new UserDatabase();
export function login(req, res) {
    const { username, password } = req.body;
    if (!password || !username) {
        res.status(StatusCodes.UNAUTHORIZED);
        res.json({
            message: "Missing one or more out of password, username!"
        });
        return;
    }
    const foundUser = userDb.getUserByUsername(username);
    if (!foundUser) {
        res.status(StatusCodes.UNAUTHORIZED);
        res.json({
            message: "Invalid username provided!"
        });
        return;
    }
    if (foundUser.password !== password) {
        res.status(StatusCodes.UNAUTHORIZED);
        res.json({
            message: "Invalid password provided!"
        });
        return;
    }
    const token = getToken(foundUser);
    res.status(StatusCodes.OK);
    res.json({
        message: "Sucessfully logged in!",
        data: token
    });
}
export function signUp(req, res) {
    const { email, password, name, username } = req.body;
    if (!email || !password || !username) {
        res.status(StatusCodes.BAD_REQUEST);
        res.json({
            message: "Missing one or more out of email, password, and username!"
        });
        return;
    }
    let foundUser = userDb.getUserByUsername(username);
    if (foundUser) {
        res.status(StatusCodes.BAD_REQUEST);
        res.json({
            message: "Username already exists with this username!"
        });
        return;
    }
    foundUser = userDb.getUserByEmail(email);
    if (foundUser) {
        res.status(StatusCodes.BAD_REQUEST);
        res.json({
            message: "User already exists with this email!"
        });
        return;
    }
    let maxId = userDb.getMaxId();
    // Add new user to the array
    const newUser = {
        id: maxId + 1,
        email,
        password,
        name,
        username,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    userDb.createUser(newUser);
    res.status(StatusCodes.CREATED);
    res.json({
        message: "Successfully created the user",
        data: newUser
    });
}
