require("dotenv").config({ quiet: true });

const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const argon = require("argon2");
const mysql = require("mysql2");
const app = express();

const port = 3000;
const responses = {
    noTokenProvided: "No token provided",
    invalidToken: "Invalid token",
    noPermission: "Forbidden",
    notFound: "Not found",
    serverError: "Internal server error",
    wrongCredentials: "Wrong credentials",
};

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "notesKeep",
});

async function hashPassword(password) {
    try {
        const hash = await argon.hash(password);
        return hash;
    } catch (e) {
        console.error(`Error while hashing: ${e}`);
        return -1;
    }
}

async function checkHashedPassword(password, hash) {
    try {
        if (await argon.verify(hash, password)) {
            return 1;
        } else {
            return 0;
        }
    } catch (e) {
        console.error(`Error while verifying hash: ${e}`);
        return -1;
    }
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: "30min" });
}
function generateRefreshToken(user) {
    let token = jwt.sign(user, process.env.JWT_REFRESH_SECRET);
    const addTokenQuery = "INSERT INTO refreshTokens VALUES(NULL, ?)";
    db.query(addTokenQuery, [token], (err, results) => {
        if (err) {
            console.error(err);
        }
    });
    return token;
}

function checkAccessToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null || token === "undefined") {
        return res.status(401).send(responses.noTokenProvided);
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(403).send(responses.invalidToken);
        } else {
            res.locals.user = user;
            next();
        }
    });
}

// authentication routes
app.post("/login", (req, res) => {
    const user = req.body;

    const findUserQuery = "SELECT * FROM users WHERE email = ?";
    db.query(findUserQuery, [user.email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send(responses.serverError);
        }
        if (results.length == 0) {
            res.status(403).send(responses.wrongCredentials);
        } else {
            const dbUser = results[0];
            const checkedPassword = await checkHashedPassword(user.password, dbUser.password);
            if (checkedPassword === 1) {
                res.status(200).json({
                    accessToken: generateAccessToken(dbUser),
                    refreshToken: generateRefreshToken(dbUser),
                });
            } else {
                res.status(403).send(responses.wrongCredentials);
            }
        }
    });
});

app.delete("/logout", (req, res) => {
    const refreshToken = req.body.token;
    const deleteTokenQuery = "DELETE FROM refreshTokens WHERE token = ?";
    db.query(deleteTokenQuery, [refreshToken], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send(responses.serverError);
        } else {
            res.status(200).send("Logged out successfully");
        }
    });
});

app.post(
    "/token",
    (req, res, next) => {
        const refreshToken = req.body.token;
        if (refreshToken == null) {
            return res.status(401).send(responses.noTokenProvided);
        }
        const findTokenQuery = "SELECT * FROM refreshTokens WHERE token = ?";
        db.query(findTokenQuery, [refreshToken], (err, results) => {
            if (err) {
                console.error(err);
            } else if (results.length == 0) {
                return res.status(403).send(responses.invalidToken);
            } else {
                next();
            }
        });
    },
    (req, res) => {
        const refreshToken = req.body.token;
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) {
                console.error(err);
                return res.status(403).send(responses.invalidToken);
            } else {
                const accessToken = generateAccessToken({
                    id: user.id,
                    email: user.email,
                    password: user.password,
                    username: user.username,
                });
                res.status(200).json({ accessToken });
            }
        });
    }
);

// user routes
app.get("/users/me", checkAccessToken, (req, res) => {
    const user = res.locals.user;

    const getUserQuery = "SELECT * FROM users WHERE id = ?";
    db.query(getUserQuery, [user.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send(responses.serverError);
        } else if (results.length == 0) {
            res.status(404).send(responses.notFound);
        } else {
            const dbUser = results[0];
            res.status(200).json(dbUser);
        }
    });
});

// listen
app.listen(port, async () => {
    console.log(`Listening on port ${port}`);
});
